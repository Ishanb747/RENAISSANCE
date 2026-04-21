import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Curriculum from './pages/Curriculum';
import Phase from './pages/Phase';
import Lesson from './pages/Lesson';
import Generate from './pages/Generate';
import Explore from './pages/Explore';
import { useProgress } from './hooks/useProgress';

export default function App() {
  const {
    progress,
    toggleLesson,
    toggleExercise,
    isLessonComplete,
    isExerciseComplete,
    getPhaseProgress,
    getOverallProgress,
    getTotalCompleted,
  } = useProgress();

  return (
    <>
      <Navbar />
      
      <main>
        <Routes>
          <Route 
            path="/" 
            element={
              <Home />
            } 
          />
          <Route 
            path="/generate" 
            element={
              <Generate />
            } 
          />
          <Route 
            path="/explore" 
            element={
              <Explore />
            } 
          />
          <Route 
            path="/path/:pathId" 
            element={
              <Curriculum 
                getPhaseProgress={getPhaseProgress}
                getOverallProgress={getOverallProgress}
              />
            } 
          />
          <Route 
            path="/path/:pathId/phase/:phaseSlug" 
            element={
              <Phase 
                isLessonComplete={isLessonComplete}
                isExerciseComplete={isExerciseComplete}
                toggleLesson={toggleLesson}
                toggleExercise={toggleExercise}
                getPhaseProgress={getPhaseProgress}
              />
            } 
          />
          <Route 
            path="/path/:pathId/phase/:phaseSlug/lesson/:lessonSlug" 
            element={
              <Lesson 
                isLessonComplete={isLessonComplete}
                toggleLesson={toggleLesson}
              />
            } 
          />
        </Routes>
      </main>
    </>
  );
}
