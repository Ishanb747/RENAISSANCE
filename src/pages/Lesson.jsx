import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { paths } from '../data/paths';
import { useEffect } from 'react';

export default function Lesson({ isLessonComplete, toggleLesson }) {
  const { pathId, phaseSlug, lessonSlug } = useParams();
  const navigate = useNavigate();

  const currentPath = paths.find(p => p.id === pathId);
  const phaseIndex = currentPath?.phases?.findIndex(p => p.slug === phaseSlug) ?? -1;
  const phase = phaseIndex > -1 ? currentPath.phases[phaseIndex] : null;
  
  if (!currentPath || !phase) {
    return <div className="min-h-screen pt-24 text-center text-[#8E8E93] bg-black">Phase not found</div>;
  }

  const lessonIndex = phase.lessons.findIndex(l => l.slug === lessonSlug);
  const lesson = phase.lessons[lessonIndex];

  if (!lesson) {
    return <div className="min-h-screen pt-24 text-center text-[#8E8E93] bg-black">Lesson not found</div>;
  }

  const isCompleted = isLessonComplete(lesson.id);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [lessonSlug]);

  const nextLesson = phase.lessons[lessonIndex + 1];
  const prevLesson = phase.lessons[lessonIndex - 1];

  const handleComplete = () => {
    if (!isCompleted) toggleLesson(lesson.id);
    if (nextLesson) {
      navigate(`/path/${pathId}/phase/${phase.slug}/lesson/${nextLesson.slug}`);
    } else {
      navigate(`/path/${pathId}/phase/${phase.slug}`);
    }
  };

  const renderContent = (block, i) => {
    switch (block.type) {
      case 'intro':
        return <p key={i} className="text-[19px] sm:text-[21px] text-[#D1D1D6] leading-[1.6] mb-10 font-light tracking-tight">{block.text}</p>;
      case 'heading':
        return <h2 key={i} className="text-2xl font-bold text-white mt-14 mb-6 tracking-tight">{block.text}</h2>;
      case 'paragraph':
        return (
          <p key={i} className="text-[17px] text-[#AEAEB2] leading-[1.6] font-light mb-6 tracking-tight" dangerouslySetInnerHTML={{ __html: block.text.replace(/\*\*(.*?)\*\*/g, '<span class="text-white font-medium">$1</span>') }} />
        );
      case 'list':
        return (
          <ul key={i} className="space-y-4 mb-10 pl-2">
            {block.items.map((item, j) => (
              <li key={j} className="flex items-start gap-4 text-[17px] text-[#AEAEB2] font-light tracking-tight">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8E8E93] mt-2.5 shrink-0" />
                <span className="leading-[1.6]" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<span class="text-white font-medium">$1</span>') }} />
              </li>
            ))}
          </ul>
        );
      case 'callout':
        return (
          <div key={i} className={`p-6 rounded-2xl bg-[rgba(28,28,30,0.5)] border border-white/5 my-10 pl-6 border-l-2 ${
            block.variant === 'warning' ? 'border-l-[#ff3b30]' : block.variant === 'important' ? 'border-l-[#ff9f0a]' : 'border-l-[#0a84ff]'
          }`}>
            <p className="text-[15px] font-medium text-[#D1D1D6] leading-relaxed tracking-tight">{block.text}</p>
          </div>
        );
      case 'quote':
        return (
          <blockquote key={i} className="my-12 px-8 border-l border-white/20">
            <p className="text-[22px] sm:text-[26px] text-white font-light italic leading-tight tracking-tight mb-4 text-[#E5E5EA]">"{block.text}"</p>
            {block.author && <footer className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-widest">— {block.author}</footer>}
          </blockquote>
        );
      case 'image':
        return (
          <div key={i} className="my-12">
            <div className="overflow-hidden rounded-2xl border border-white/10 glass-bright flex justify-center">
              <img src={block.url} alt={block.alt || block.caption || 'Lesson visual'} className="w-full h-auto object-cover" />
            </div>
            {block.caption && (
              <p className="mt-4 text-center text-[13px] text-[#8E8E93] tracking-wide">{block.caption}</p>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-32 px-6 sm:px-12 bg-black">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-[13px] font-medium text-[#8E8E93] mb-12">
          <Link to={`/path/${pathId}`} className="hover:text-white transition-colors">Path Curriculum</Link>
          <span>/</span>
          <Link to={`/path/${pathId}/phase/${phase.slug}`} className="hover:text-white transition-colors line-clamp-1">Phase {phase.id}</Link>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 mb-4 text-[11px] font-semibold text-[#8E8E93] tracking-widest uppercase">
            <span>Phase {phase.id}</span>
            <span>•</span>
            <span>{lesson.duration}</span>
          </div>
          <h1 className="text-4xl sm:text-[40px] font-bold text-white leading-tight tracking-tight">
            {lesson.title}
          </h1>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="max-w-none space-y-2"
        >
          {lesson.content.map(renderContent)}
        </motion.div>

        {/* Key Takeaways */}
        {lesson.keyTakeaways?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-20 pt-10 border-t border-white/5"
          >
            <h3 className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-widest mb-6">
              Key Takeaways
            </h3>
            <ul className="space-y-4">
              {lesson.keyTakeaways.map((takeaway, i) => (
                <li key={i} className="flex items-start gap-4 text-[16px] text-[#D1D1D6] font-light tracking-tight">
                  <span className="w-[3px] h-[3px] rounded-full bg-white mt-[11px] shrink-0" />
                  {takeaway}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Action Bar */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-4">
            {prevLesson ? (
              <Link
                to={`/path/${pathId}/phase/${phase.slug}/lesson/${prevLesson.slug}`}
                className="text-[14px] text-[#8E8E93] hover:text-white transition-colors flex items-center gap-2 font-medium"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Link>
            ) : (
              <Link
                to={`/path/${pathId}/phase/${phase.slug}`}
                className="text-[14px] text-[#8E8E93] hover:text-white transition-colors flex items-center gap-2 font-medium"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                Up to Phase {phase.id}
              </Link>
            )}
          </div>

          <button
            onClick={handleComplete}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-full font-medium text-[15px] flex items-center justify-center gap-2 transition-all duration-300 ${
              isCompleted
                ? 'bg-transparent text-[#8E8E93] border border-white/10 hover:text-white hover:border-white/30'
                : 'bg-white text-black hover:scale-105'
            }`}
          >
            {isCompleted ? (
              <>Completed</>
            ) : (
              <>Mark Complete</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
