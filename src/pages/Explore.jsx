import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { paths as staticPaths, getApiBase } from '../data/paths';

export default function Explore() {
  const [allPaths, setAllPaths] = useState(staticPaths);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGeneratedPaths() {
      try {
        const base = await getApiBase();
        if (!base) {
          setIsLoading(false);
          return;
        }
        const response = await fetch(`${base}/allpaths`);
        if (response.ok) {
          const generatedPaths = await response.json();
          // Filter out coming soon paths and merge
          const activeStatic = staticPaths.filter(p => p.status === 'active');
          setAllPaths([...activeStatic, ...generatedPaths]);
        }
      } catch (err) {
        console.error("Failed to load generated paths:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadGeneratedPaths();
  }, []);

  // Filter based on search query
  const filteredPaths = allPaths.filter(path => {
    const query = searchQuery.toLowerCase();
    return (
      path.title?.toLowerCase().includes(query) ||
      path.description?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 sm:px-12 bg-black text-[#F2F2F7]">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Spotlight Search */}
        <div className="mb-16 text-center">
          <motion.h1
            className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            Explore the Curriculum
          </motion.h1>
          
          <motion.div
            className="max-w-2xl mx-auto relative group"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A84FF]/20 to-[#5E5CE6]/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-center glass-bright border border-white/10 rounded-2xl p-2 bg-[rgba(44,44,46,0.6)] focus-within:bg-[rgba(44,44,46,0.9)] focus-within:border-white/20 transition-all">
              <svg className="w-6 h-6 text-[#8E8E93] ml-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search masterclasses, topics, or frameworks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-white text-[17px] font-light placeholder:text-[#636366] focus:outline-none focus:ring-0 px-4 py-3"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="mr-3 p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <svg className="w-5 h-5 text-[#8E8E93]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
             <div className="relative w-12 h-12">
               <div className="absolute inset-0 rounded-full border-2 border-white/10 border-t-[#0A84FF] animate-spin" />
             </div>
          </div>
        ) : (
          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } }
            }}
          >
            <AnimatePresence>
              {filteredPaths.length > 0 ? (
                filteredPaths.map((path) => (
                  <motion.div
                    key={path.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      to={`/path/${path.id}`}
                      className="block group h-full glass-bright p-6 rounded-3xl border border-white/5 hover:border-white/20 transition-all duration-300 hover:bg-[rgba(58,58,60,0.5)] flex flex-col"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-white group-hover:text-black transition-colors">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        {path.isGenerated && (
                          <span className="px-2 py-1 text-[9px] font-semibold tracking-widest text-[#0A84FF] uppercase rounded-md border border-[#0A84FF]/20 bg-[rgba(10,132,255,0.1)]">
                            AI Generated
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-bold text-white tracking-tight mb-2">{path.title}</h3>
                      <p className="text-[#8E8E93] leading-relaxed text-[14px] font-light flex-1 line-clamp-3 mb-6">
                        {path.description}
                      </p>
                      
                      <div className="pt-4 border-t border-white/5 mt-auto flex items-center">
                        <span className="text-sm font-semibold text-white tracking-tight mr-1">
                          {(path.phases ? path.phases.length : path.phaseCount) || 0}
                        </span>
                        <span className="text-[10px] font-medium text-[#636366] uppercase tracking-wide">Phases</span>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 text-center flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#636366]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No masterclasses found</h3>
                  <p className="text-[#8E8E93] text-sm">Update your search or generate a new path.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
        
      </div>
    </div>
  );
}
