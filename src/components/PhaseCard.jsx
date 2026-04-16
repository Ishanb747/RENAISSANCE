import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PhaseCard({ phase, progress, index, pathId }) {
  const isLocked = false; 

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
    >
      <Link
        to={`/path/${pathId}/phase/${phase.slug}`}
        className={`block group relative rounded-2xl transition-all duration-300 ${
          isLocked ? 'opacity-50 pointer-events-none' : 'hover:scale-[1.01]'
        }`}
      >
        <div className="glass-bright rounded-2xl p-6 md:p-8 transition-colors duration-300 group-hover:bg-[rgba(58,58,60,0.5)] border border-white/5 group-hover:border-white/10">
          
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-widest mb-1.5">
                Phase {phase.id}
              </p>
              <h3 className="text-xl md:text-2xl font-semibold text-[#F2F2F7] tracking-tight group-hover:text-white transition-colors">
                {phase.title}
              </h3>
            </div>
            
            {progress === 100 && (
              <div className="w-7 h-7 rounded-full border border-white/10 bg-white/5 flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>

          <p className="text-sm text-[#AEAEB2] leading-relaxed mb-8 max-w-2xl font-light">
            {phase.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 mb-6">
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-white tracking-tight">{phase.lessons.length}</span>
              <span className="text-[11px] font-medium text-[#636366] uppercase tracking-wide">Lessons</span>
            </div>
            {phase.exercises?.length > 0 && (
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-white tracking-tight">{phase.exercises.length}</span>
                <span className="text-[11px] font-medium text-[#636366] uppercase tracking-wide">Exercises</span>
              </div>
            )}
            {phase.resources?.length > 0 && (
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-white tracking-tight">{phase.resources.length}</span>
                <span className="text-[11px] font-medium text-[#636366] uppercase tracking-wide">Resources</span>
              </div>
            )}
          </div>

          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#636366]">Progress</span>
              <span className="text-[10px] font-semibold text-[#8E8E93]">{progress}%</span>
            </div>
            <div className="w-full h-[3px] rounded-full bg-[#2C2C2E] overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
