import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePathData } from '../hooks/usePathData';
import PhaseCard from '../components/PhaseCard';

export default function Curriculum({ getPhaseProgress, getOverallProgress }) {
  const { pathId } = useParams();
  const { path: currentPath, loading, error } = usePathData(pathId);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center bg-black">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-[#8E8E93] text-sm">Loading curriculum...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !currentPath) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-white mb-3">Path not found</h1>
          <p className="text-[#8E8E93] mb-6 text-sm">{error || 'This learning path does not exist.'}</p>
          <Link to="/" className="text-sm font-medium text-white hover:text-[#AEAEB2] transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const { phases } = currentPath;
  const overallProgress = getOverallProgress(phases);

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 sm:px-12 bg-black">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <Link to="/" className="inline-flex items-center gap-2 text-[13px] font-medium text-[#8E8E93] hover:text-white transition-colors mb-8">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Paths
          </Link>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            {currentPath.title}
          </h1>
          <p className="text-[#8E8E93] text-lg max-w-2xl font-light leading-relaxed mb-8">
            {currentPath.description}
          </p>

          {currentPath.isGenerated && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(10,132,255,0.1)] border border-[#0A84FF]/20 mb-8">
              <svg className="w-3.5 h-3.5 text-[#0A84FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-[12px] font-semibold text-[#0A84FF] tracking-wide">AI Generated</span>
            </div>
          )}

          <div className="glass rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-[#636366] tracking-widest uppercase">Overall Progress</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#2C2C2E] overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        <div className="relative">
          <div className="absolute left-6 top-8 bottom-8 w-[1px] bg-gradient-to-b from-white/20 via-white/10 to-transparent hidden sm:block" />

          <div className="space-y-6">
            {phases.map((phase, index) => (
              <div key={phase.id} className="relative sm:pl-16">
                <div className="hidden sm:flex absolute left-[21px] top-10 w-2 h-2 rounded-full z-10 transition-colors duration-500"
                  style={{ 
                    backgroundColor: getPhaseProgress(phase) === 100 
                      ? '#FFFFFF' 
                      : getPhaseProgress(phase) > 0 
                        ? '#8E8E93' 
                        : '#2C2C2E',
                    boxShadow: getPhaseProgress(phase) === 100 ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
                  }}
                />

                <PhaseCard
                  phase={phase}
                  progress={getPhaseProgress(phase)}
                  index={index}
                  pathId={pathId}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
