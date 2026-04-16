import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { paths } from '../data/paths';
import PhaseCard from '../components/PhaseCard';

export default function Curriculum({ getPhaseProgress, getOverallProgress }) {
  const { pathId } = useParams();
  const currentPath = paths.find(p => p.id === pathId);

  if (!currentPath) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center bg-black text-[#8E8E93]">
        Path not found
      </div>
    );
  }

  const { phases } = currentPath;
  const totalLessons = phases.reduce((acc, p) => acc + p.lessons.length, 0);
  const overallProgress = getOverallProgress(phases);
  // Re-calculate the total completed specific to this path
  const completedLessons = phases.reduce((acc, p) => 
    acc + p.lessons.filter(l => getPhaseProgress(p) > 0).length, 0); 
  // Wait, `getOverallProgress` from the hook uses global logic. But overall progress should adapt correctly. 
  // We'll rely on getOverallProgress for now.

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

                {/* We pass pathId to PhaseCard implicitly or update PhaseCard to accept it */}
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
