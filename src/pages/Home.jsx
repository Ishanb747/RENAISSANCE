import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { paths as staticPaths, getApiBase } from '../data/paths';

export default function Home() {
  const [allPaths, setAllPaths] = useState(staticPaths);

  useEffect(() => {
    async function loadGeneratedPaths() {
      try {
        const base = await getApiBase();
        if (!base) return;
        const response = await fetch(`${base}/allpaths`);
        if (response.ok) {
          const generatedPaths = await response.json();
          // Filter active statics, and grab up to 2 most recent dynamic paths
          const activeStatic = staticPaths.filter(p => p.status === 'active');
          const recentDynamic = generatedPaths.slice(-2).reverse();
          setAllPaths([...activeStatic, ...recentDynamic]);
        }
      } catch (err) {
        console.error("Failed to load generated paths:", err);
      }
    }
    loadGeneratedPaths();
  }, []);
  return (
    <div className="min-h-screen bg-black text-[#F2F2F7]">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 sm:px-12 flex flex-col items-center justify-center pt-48 pb-32">
        <div className="max-w-4xl mx-auto text-center relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="mb-8 inline-block">
              <span className="px-3 py-1 text-[11px] font-semibold tracking-widest text-[#8E8E93] uppercase rounded-full border border-white/10 glass">
                Platform
              </span>
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl sm:text-7xl lg:text-[84px] font-bold tracking-tight leading-[1.05] mb-8 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          >
            Welcome to
            <br />
            <span className="text-[#8E8E93]">Renaissance.</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-[#AEAEB2] max-w-2xl mx-auto mb-12 leading-relaxed font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            The comprehensive curriculum for human excellence. 
            Select a learning path below to begin your mastery journey.
          </motion.p>
        </div>
      </section>

      {/* Learning Paths */}
      <section className="py-24 px-6 sm:px-12 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
              Learning Paths
            </h2>
            <p className="text-[#AEAEB2] max-w-2xl font-light">
              Choose an active module to dive into the core curriculum.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Generate Card — Special CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0, ease: "easeOut" }}
            >
              <Link
                to="/generate"
                className="block group h-full rounded-3xl p-8 border border-[#0A84FF]/20 bg-gradient-to-br from-[rgba(10,132,255,0.08)] to-[rgba(94,92,230,0.04)] hover:border-[#0A84FF]/40 hover:from-[rgba(10,132,255,0.12)] hover:to-[rgba(94,92,230,0.08)] transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0A84FF] to-[#5E5CE6] flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white tracking-tight">Generate a Path</h3>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-[#0A84FF]/30 bg-[rgba(10,132,255,0.1)] flex items-center justify-center shrink-0 group-hover:bg-[#0A84FF] group-hover:border-[#0A84FF] transition-colors">
                    <svg className="w-4 h-4 text-[#0A84FF] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
                <p className="text-[#8E8E93] leading-relaxed text-[15px]">
                  Upload a PDF, paste YouTube links, or add website URLs — AI will create a structured learning pathway from your materials.
                </p>

                <div className="mt-8 pt-6 border-t border-[#0A84FF]/10 flex items-center gap-2">
                  <span className="px-2.5 py-1 text-[10px] font-semibold tracking-widest text-[#0A84FF] uppercase rounded-md border border-[#0A84FF]/20 bg-[rgba(10,132,255,0.1)]">
                    AI Powered
                  </span>
                </div>
              </Link>
            </motion.div>

            {/* Existing path cards */}
            {allPaths.map((path, i) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i + 1) * 0.1, ease: "easeOut" }}
              >
                {path.status === 'active' ? (
                  <Link
                    to={`/path/${path.id}`}
                    className="block group h-full glass-bright p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all duration-300 hover:bg-[rgba(58,58,60,0.5)]"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-white tracking-tight">{path.title}</h3>
                      <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-[#8E8E93] leading-relaxed text-[15px]">{path.description}</p>
                    
                    <div className="mt-8 pt-6 border-t border-white/5 flex items-center gap-6">
                       <div className="flex flex-col">
                         <span className="text-lg font-semibold text-white tracking-tight">{(path.phases ? path.phases.length : path.phaseCount) || 0}</span>
                         <span className="text-[11px] font-medium text-[#636366] uppercase tracking-wide">Phases</span>
                       </div>
                    </div>
                  </Link>
                ) : (
                  <div className="h-full p-8 rounded-3xl border border-white/5 bg-[rgba(28,28,30,0.3)] opacity-70">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-[#8E8E93] tracking-tight">{path.title}</h3>
                      <span className="px-2.5 py-1 text-[10px] font-semibold tracking-widest text-[#636366] uppercase rounded-md border border-white/5 bg-white/5">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-[#636366] leading-relaxed text-[15px]">{path.description}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Explore More CTA */}
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, ease: "easeOut" }}
          >
            <Link
              to="/explore"
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white font-medium text-[15px]"
            >
              <svg className="w-4 h-4 text-[#8E8E93]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Explore all masterclasses
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 sm:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#8E8E93] tracking-tight">Renaissance Platform</span>
          </div>
          <p className="text-xs text-[#636366]">
            Built for mastery.
          </p>
        </div>
      </footer>
    </div>
  );
}
