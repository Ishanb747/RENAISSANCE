import { curriculum as stageAcademy } from './curriculum';
import { kataCurriculum } from './kataCurriculum';
import { comedyCurriculum } from './comedyCurriculum';

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
    id: 'kata-series',
    title: 'The Kata Series',
    description: 'Deep-dive mental models on attempting hard things, reading human competence, and avoiding the trap of being average.',
    phases: kataCurriculum,
    status: 'active'
  },
  {
    id: 'understanding-comedy',
    title: 'Understanding Comedy',
    description: 'Deconstruct the science and math behind stand-up comedy. Learn joke writing, character building, and the mechanics of making people laugh.',
    phases: comedyCurriculum,
    status: 'active'
  }
];
