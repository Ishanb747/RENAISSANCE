import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePathData } from '../hooks/usePathData';

export default function Phase({ isLessonComplete, isExerciseComplete, toggleLesson, toggleExercise, getPhaseProgress }) {
  const { pathId, phaseSlug } = useParams();
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
          <p className="text-[#8E8E93] text-sm">Loading phase...</p>
        </motion.div>
      </div>
    );
  }

  const phaseIndex = currentPath?.phases?.findIndex(p => p.slug === phaseSlug) ?? -1;
  const phase = phaseIndex > -1 ? currentPath.phases[phaseIndex] : null;

  if (error || !currentPath || !phase) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-white mb-3">Phase not found</h1>
          <p className="text-[#8E8E93] mb-6 text-sm">{error || 'This phase does not exist in this curriculum path.'}</p>
          <Link to={`/path/${pathId || 'stage-academy'}`} className="text-sm font-medium text-white hover:text-[#AEAEB2] transition-colors">
            ← Back to Path
          </Link>
        </div>
      </div>
    );
  }

  const progress = getPhaseProgress(phase);
  const curriculum = currentPath.phases;

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 sm:px-12 bg-black">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-14"
        >
          <Link to={`/path/${pathId}`} className="inline-flex items-center gap-2 text-[13px] font-medium text-[#8E8E93] hover:text-white transition-colors mb-8">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Path
          </Link>

          <div>
            <p className="text-xs font-semibold text-[#8E8E93] uppercase tracking-widest mb-3">Phase {phase.id}</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight mb-5">{phase.title}</h1>
          </div>

          <p className="text-[#AEAEB2] text-[17px] leading-relaxed mb-10 max-w-2xl font-light">{phase.description}</p>

          {/* Progress */}
          <div className="pt-8 border-t border-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-medium text-[#636366] uppercase tracking-widest">Phase Progress</span>
              <span className="text-[11px] font-semibold text-white">{progress}%</span>
            </div>
            <div className="w-full h-1 pl-0 rounded-full bg-[#2C2C2E] overflow-hidden">
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Lessons */}
        <motion.section
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="mb-14"
        >
          <h2 className="text-sm font-semibold text-[#8E8E93] uppercase tracking-widest mb-6">Lessons</h2>
          <div className="space-y-3">
            {phase.lessons.map((lesson, i) => {
              const completed = isLessonComplete(lesson.id);
              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className={`glass-bright rounded-2xl transition-colors duration-300 ${
                    completed ? 'bg-[rgba(255,255,255,0.02)]' : 'hover:bg-[rgba(58,58,60,0.5)]'
                  }`}
                >
                  <div className="flex items-center p-4 sm:p-5 gap-5">
                    <button
                      onClick={() => toggleLesson(lesson.id)}
                      className={`w-6 h-6 rounded-full border flex flex-shrink-0 items-center justify-center transition-all duration-300 ${
                        completed
                          ? 'border-white bg-white text-black'
                          : 'border-[#636366] hover:border-white'
                      }`}
                    >
                      {completed && (
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>

                    <Link
                      to={`/path/${pathId}/phase/${phase.slug}/lesson/${lesson.slug}`}
                      className="flex-1 min-w-0"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`font-semibold text-[15px] tracking-tight mb-1 transition-colors ${
                            completed ? 'text-[#636366]' : 'text-white'
                          }`}>
                            {lesson.title}
                          </h3>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] font-medium text-[#636366] uppercase tracking-wider">
                              {lesson.type}
                            </span>
                            <span className="text-[11px] text-[#48484A]">•</span>
                            <span className="text-[11px] font-medium text-[#636366] tracking-wider">
                              {lesson.duration}
                            </span>
                          </div>
                        </div>
                        <svg className={`w-4 h-4 shrink-0 transition-colors ${completed ? 'text-[#48484A]' : 'text-[#8E8E93]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Exercises */}
        {phase.exercises?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mb-14"
          >
            <h2 className="text-sm font-semibold text-[#8E8E93] uppercase tracking-widest mb-6 border-t border-white/5 pt-10">Exercises & Challenges</h2>
            <div className="space-y-3">
              {phase.exercises.map((exercise, i) => {
                const completed = isExerciseComplete(exercise.id);
                return (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i }}
                    className={`glass-bright rounded-2xl p-5 border-none transition-colors duration-300 ${
                      completed ? 'bg-[rgba(255,255,255,0.02)]' : 'hover:bg-[rgba(58,58,60,0.5)]'
                    }`}
                  >
                    <div className="flex items-start gap-5">
                      <button
                        onClick={() => toggleExercise(exercise.id)}
                        className={`w-6 h-6 rounded-full border mt-0.5 flex flex-shrink-0 items-center justify-center transition-all duration-300 ${
                          completed
                            ? 'border-white bg-white text-black'
                            : 'border-[#636366] hover:border-white'
                        }`}
                      >
                        {completed && (
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1">
                        <div className="mb-2">
                          <span className="text-[10px] font-semibold tracking-widest uppercase border border-white/10 rounded px-2 py-0.5 text-[#8E8E93]">
                            {exercise.type}
                          </span>
                        </div>
                        <h3 className={`font-semibold text-[15px] tracking-tight mb-1.5 transition-colors ${
                          completed ? 'text-[#636366]' : 'text-white'
                        }`}>
                          {exercise.title}
                        </h3>
                        <p className={`text-[13px] leading-relaxed transition-colors ${
                          completed ? 'text-[#48484A]' : 'text-[#AEAEB2]'
                        }`}>
                          {exercise.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Resources */}
        {phase.resources?.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="mb-14"
          >
            <h2 className="text-sm font-semibold text-[#8E8E93] uppercase tracking-widest mb-6 border-t border-white/5 pt-10">Resources</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {phase.resources.map((resource, i) => (
                <a
                  key={i}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-bright rounded-2xl p-5 border-none hover:bg-[rgba(58,58,60,0.5)] transition-colors duration-300 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5 text-[#8E8E93] group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-[14px] font-medium text-white tracking-tight mb-1 line-clamp-2">
                        {resource.title}
                      </h4>
                      <p className="text-[11px] font-medium text-[#636366] uppercase tracking-wider">
                        {resource.type}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </motion.section>
        )}

        {/* Project */}
        {phase.project && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          >
            <h2 className="text-sm font-semibold text-[#8E8E93] uppercase tracking-widest mb-6 border-t border-white/5 pt-10">Phase Project</h2>
            <div className="glass-bright rounded-2xl p-8 border-none bg-[rgba(28,28,30,0.8)]">
              <h3 className="font-semibold text-lg text-white tracking-tight mb-3">{phase.project.title}</h3>
              <p className="text-[14px] text-[#AEAEB2] leading-relaxed font-light">{phase.project.description}</p>
            </div>
          </motion.section>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-16 pt-8 border-t border-white/5">
          {phaseIndex > 0 ? (
            <Link
              to={`/path/${pathId}/phase/${curriculum[phaseIndex - 1].slug}`}
              className="text-[13px] font-medium text-[#8E8E93] hover:text-white transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              Phase {curriculum[phaseIndex - 1].id}
            </Link>
          ) : <div />}
          {phaseIndex < curriculum.length - 1 ? (
            <Link
              to={`/path/${pathId}/phase/${curriculum[phaseIndex + 1].slug}`}
              className="text-[13px] font-medium text-[#8E8E93] hover:text-white transition-colors flex items-center gap-2"
            >
              Phase {curriculum[phaseIndex + 1].id}
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
