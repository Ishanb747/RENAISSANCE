import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { paths } from '../data/paths';

export default function Home() {
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
            {paths.map((path, i) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, ease: "easeOut" }}
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
                         <span className="text-lg font-semibold text-white tracking-tight">{path.phases?.length || 0}</span>
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
