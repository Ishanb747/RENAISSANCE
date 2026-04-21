import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadData } from 'aws-amplify/storage';
import { Link } from 'react-router-dom';

export default function Generate() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [youtubeUrls, setYoutubeUrls] = useState(['']);
  const [websiteUrls, setWebsiteUrls] = useState(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get API base from aws-exports
  const getApiBase = async () => {
    try {
      const awsExports = (await import('../aws-exports')).default;
      const endpoints = awsExports.aws_cloud_logic_custom || [];
      if (endpoints.length > 0) return endpoints[0].endpoint;
    } catch (e) {
      console.warn('Could not load API base:', e);
    }
    return '';
  };

  // Dynamic YouTube URL rows
  const addYoutubeUrl = () => setYoutubeUrls([...youtubeUrls, '']);
  const removeYoutubeUrl = (index) => setYoutubeUrls(youtubeUrls.filter((_, i) => i !== index));
  const updateYoutubeUrl = (index, value) => {
    const updated = [...youtubeUrls];
    updated[index] = value;
    setYoutubeUrls(updated);
  };

  // Dynamic Website URL rows
  const addWebsiteUrl = () => setWebsiteUrls([...websiteUrls, '']);
  const removeWebsiteUrl = (index) => setWebsiteUrls(websiteUrls.filter((_, i) => i !== index));
  const updateWebsiteUrl = (index, value) => {
    const updated = [...websiteUrls];
    updated[index] = value;
    setWebsiteUrls(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please enter a pathway title.');
      return;
    }

    const filteredYoutube = youtubeUrls.filter(u => u.trim());
    const filteredWebsite = websiteUrls.filter(u => u.trim());

    if (!pdfFile && filteredYoutube.length === 0 && filteredWebsite.length === 0) {
      setError('Please provide at least one source: a PDF, YouTube URL, or website URL.');
      return;
    }

    setLoading(true);

    try {
      // Upload PDF to S3 if provided
      let pdfKey = null;
      if (pdfFile) {
        const fileName = `public/uploads/${Date.now()}-${pdfFile.name}`;
        const result = await uploadData({
          path: fileName,
          data: pdfFile,
          options: {
            contentType: pdfFile.type,
          }
        }).result;
        pdfKey = result.path || fileName;
      }

      // Call the generate API
      const apiBase = await getApiBase();
      if (!apiBase) {
        throw new Error('API not configured. Please deploy the backend first.');
      }

      const pathId = crypto.randomUUID();

      const response = await fetch(`${apiBase}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          pdfKey,
          youtubeUrls: filteredYoutube,
          websiteUrls: filteredWebsite,
          pathId: pathId
        }),
      });

      // If it completed perfectly in under 29 seconds:
      if (response.ok) {
        navigate(`/path/${pathId}`);
        return;
      }

      // If we got a 504 (or other 500 error from API Gateway timeout):
      if (response.status === 504 || response.status >= 500) {
         console.warn("[Generate] API Gateway timeout. Polling DB for background completion...");
         
         // Poll DynamoDB every 5 seconds for up to 4 minutes (48 attempts)
         for (let i = 0; i < 48; i++) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            try {
               const checkResp = await fetch(`${apiBase}/paths/${pathId}`);
               if (checkResp.ok) {
                  navigate(`/path/${pathId}`);
                  return;
               }
            } catch (err) {
               console.error("Polling error:", err);
            }
         }
         throw new Error("Generation is taking longer than expected. It may appear on your dashboard later.");
      }

      // Otherwise it's a fast intentional error from the backend (400 validation error, etc.)
      const data = await response.json().catch(() => ({}));
      let errorMsg = data.error || 'Generation failed';
      throw new Error(errorMsg);

    } catch (err) {
      console.error('[Generate] Error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 sm:px-12 bg-black">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Link to="/" className="inline-flex items-center gap-2 text-[13px] font-medium text-[#8E8E93] hover:text-white transition-colors mb-8">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0A84FF] to-[#5E5CE6] flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
              Generate a Path
            </h1>
          </div>
          <p className="text-[#8E8E93] text-lg font-light leading-relaxed max-w-xl">
            Upload your source materials and let AI create a structured learning pathway. 
            Provide a PDF, YouTube videos, or website links.
          </p>
        </motion.div>

        {/* Loading Overlay */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                className="flex flex-col items-center gap-6 text-center px-8"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-white/10 border-t-[#0A84FF] animate-spin" />
                  <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-b-[#5E5CE6] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                </div>
                <div>
                  <p className="text-xl font-semibold text-white mb-2">AI is building your curriculum...</p>
                  <p className="text-[#8E8E93] text-sm">Extracting concepts, designing syllabus, writing content. This takes 2–4 minutes.</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 rounded-2xl bg-[rgba(255,59,48,0.1)] border border-[#ff3b30]/20"
              >
                <p className="text-[14px] text-[#ff3b30] font-medium">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-[#8E8E93] uppercase tracking-widest mb-3">
              Pathway Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Machine Learning Fundamentals"
              className="w-full px-5 py-4 rounded-2xl bg-[rgba(44,44,46,0.5)] border border-white/5 text-white text-[16px] font-light placeholder:text-[#636366] focus:outline-none focus:border-white/20 focus:bg-[rgba(44,44,46,0.8)] transition-all duration-200"
              disabled={loading}
            />
          </div>

          {/* PDF Upload */}
          <div>
            <label className="block text-xs font-semibold text-[#8E8E93] uppercase tracking-widest mb-3">
              PDF Document
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPdfFile(e.target.files[0] || null)}
                className="hidden"
                id="pdf-upload"
                disabled={loading}
              />
              <label
                htmlFor="pdf-upload"
                className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl border border-dashed cursor-pointer transition-all duration-200 ${
                  pdfFile 
                    ? 'border-[#0A84FF]/40 bg-[rgba(10,132,255,0.05)]' 
                    : 'border-white/10 bg-[rgba(44,44,46,0.3)] hover:border-white/20 hover:bg-[rgba(44,44,46,0.5)]'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  pdfFile ? 'bg-[rgba(10,132,255,0.15)]' : 'bg-white/5'
                }`}>
                  <svg className={`w-5 h-5 ${pdfFile ? 'text-[#0A84FF]' : 'text-[#8E8E93]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  {pdfFile ? (
                    <>
                      <p className="text-[15px] text-white font-medium truncate">{pdfFile.name}</p>
                      <p className="text-[12px] text-[#8E8E93]">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </>
                  ) : (
                    <>
                      <p className="text-[15px] text-[#AEAEB2]">Choose a PDF file</p>
                      <p className="text-[12px] text-[#636366]">Max 5 MB for synchronous processing</p>
                    </>
                  )}
                </div>
                {pdfFile && (
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); setPdfFile(null); }}
                    className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <svg className="w-4 h-4 text-[#8E8E93]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </label>
            </div>
          </div>

          {/* YouTube URLs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-[#8E8E93] uppercase tracking-widest">
                YouTube Videos
              </label>
              <button
                type="button"
                onClick={addYoutubeUrl}
                className="text-[12px] font-semibold text-[#0A84FF] hover:text-[#409CFF] transition-colors"
                disabled={loading}
              >
                + Add URL
              </button>
            </div>
            <div className="space-y-3">
              {youtubeUrls.map((url, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[rgba(255,55,95,0.1)] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-[#FF375F]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateYoutubeUrl(i, e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="flex-1 px-4 py-3 rounded-xl bg-[rgba(44,44,46,0.5)] border border-white/5 text-white text-[15px] font-light placeholder:text-[#636366] focus:outline-none focus:border-white/20 transition-all duration-200"
                    disabled={loading}
                  />
                  {youtubeUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeYoutubeUrl(i)}
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                      disabled={loading}
                    >
                      <svg className="w-4 h-4 text-[#636366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Website URLs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-semibold text-[#8E8E93] uppercase tracking-widest">
                Website Links
              </label>
              <button
                type="button"
                onClick={addWebsiteUrl}
                className="text-[12px] font-semibold text-[#0A84FF] hover:text-[#409CFF] transition-colors"
                disabled={loading}
              >
                + Add URL
              </button>
            </div>
            <div className="space-y-3">
              {websiteUrls.map((url, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[rgba(10,132,255,0.1)] flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-[#0A84FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateWebsiteUrl(i, e.target.value)}
                    placeholder="https://example.com/article"
                    className="flex-1 px-4 py-3 rounded-xl bg-[rgba(44,44,46,0.5)] border border-white/5 text-white text-[15px] font-light placeholder:text-[#636366] focus:outline-none focus:border-white/20 transition-all duration-200"
                    disabled={loading}
                  />
                  {websiteUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWebsiteUrl(i)}
                      className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                      disabled={loading}
                    >
                      <svg className="w-4 h-4 text-[#636366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-8 rounded-2xl bg-white text-black font-semibold text-[16px] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Generate My Path
            </button>
            <p className="text-center text-[12px] text-[#636366] mt-4">
              Generation takes 2–4 minutes. The AI extracts concepts, designs the syllabus, then writes deep content for each phase.
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
