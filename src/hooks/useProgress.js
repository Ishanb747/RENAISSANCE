import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'stage-academy-progress';

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : { completedLessons: [], completedExercises: [], completedPhases: [] };
  } catch {
    return { completedLessons: [], completedExercises: [], completedPhases: [] };
  }
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const toggleLesson = useCallback((lessonId) => {
    setProgress(prev => {
      const completed = prev.completedLessons.includes(lessonId)
        ? prev.completedLessons.filter(id => id !== lessonId)
        : [...prev.completedLessons, lessonId];
      return { ...prev, completedLessons: completed };
    });
  }, []);

  const toggleExercise = useCallback((exerciseId) => {
    setProgress(prev => {
      const completed = prev.completedExercises.includes(exerciseId)
        ? prev.completedExercises.filter(id => id !== exerciseId)
        : [...prev.completedExercises, exerciseId];
      return { ...prev, completedExercises: completed };
    });
  }, []);

  const isLessonComplete = useCallback((lessonId) => {
    return progress.completedLessons.includes(lessonId);
  }, [progress.completedLessons]);

  const isExerciseComplete = useCallback((exerciseId) => {
    return progress.completedExercises.includes(exerciseId);
  }, [progress.completedExercises]);

  const getPhaseProgress = useCallback((phase) => {
    const totalItems = phase.lessons.length + (phase.exercises?.length || 0);
    const completedItems = phase.lessons.filter(l => progress.completedLessons.includes(l.id)).length
      + (phase.exercises?.filter(e => progress.completedExercises.includes(e.id))?.length || 0);
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  }, [progress]);

  const getOverallProgress = useCallback((phases) => {
    const totalLessons = phases.reduce((acc, p) => acc + p.lessons.length, 0);
    const completedLessons = progress.completedLessons.length;
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  }, [progress]);

  const getTotalCompleted = useCallback(() => {
    return progress.completedLessons.length;
  }, [progress]);

  return {
    progress,
    toggleLesson,
    toggleExercise,
    isLessonComplete,
    isExerciseComplete,
    getPhaseProgress,
    getOverallProgress,
    getTotalCompleted,
  };
}
