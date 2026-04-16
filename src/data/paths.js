import { curriculum as stageAcademy } from './curriculum';

export const paths = [
  {
    id: 'stage-academy',
    title: 'STAGE Academy',
    description: 'Master the art of communication, body language, and vocal delivery through an intensive 7-phase curriculum.',
    phases: stageAcademy,
    status: 'active'
  },
  {
    id: 'mindset-mastery',
    title: 'Mindset Mastery',
    description: 'Develop the philosophical foundations of success. Learn mental frameworks for resilience and growth.',
    phases: [],
    status: 'coming_soon'
  },
  {
    id: 'charismatic-leadership',
    title: 'Charismatic Leadership',
    description: 'Learn how to lead with conviction, build deep rapport, and command the room.',
    phases: [],
    status: 'coming_soon'
  }
];
