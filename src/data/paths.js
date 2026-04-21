import { curriculum as stageAcademy } from './curriculum';
import { kataCurriculum } from './kataCurriculum';
import { comedyCurriculum } from './comedyCurriculum';

// ---------------------------------------------------------------------------
// Static paths — these load instantly with zero API calls.
// ---------------------------------------------------------------------------
export const STATIC_PATHS = [
  {
    id: 'stage-academy',
    title: 'STAGE Academy',
    description: 'Master the art of communication, body language, and vocal delivery through an intensive 7-phase curriculum.',
    phases: stageAcademy,
    status: 'active'
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

// Backward compatibility — components that import { paths } still work.
export const paths = STATIC_PATHS;

// ---------------------------------------------------------------------------
// API base URL — populated after `amplify add api` and `amplify push`.
// Import from aws-exports to get the REST API endpoint dynamically.
// ---------------------------------------------------------------------------
let API_BASE = '';

export async function getApiBase() {
  if (API_BASE) return API_BASE;
  try {
    const awsExports = (await import('../aws-exports')).default;
    // Amplify REST API endpoints are stored under aws_cloud_logic_custom
    const endpoints = awsExports.aws_cloud_logic_custom || [];
    if (endpoints.length > 0) {
      API_BASE = endpoints[0].endpoint;
    }
  } catch (e) {
    console.warn('[paths] Could not load API base from aws-exports:', e);
  }
  return API_BASE;
}

// ---------------------------------------------------------------------------
// Hybrid getPath — static first, then API fallback.
// ---------------------------------------------------------------------------
export async function getPath(pathId) {
  // 1. Check static paths first (instant, no API call)
  const staticPath = STATIC_PATHS.find(p => p.id === pathId);
  if (staticPath) {
    return staticPath;
  }

  // 2. Fetch from API (AI-generated paths stored in DynamoDB)
  const base = await getApiBase();
  if (!base) {
    throw new Error('API not configured. Please deploy the backend first.');
  }

  const response = await fetch(`${base}/paths/${pathId}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch path: ${response.status}`);
  }

  const pathway = await response.json();

  // Normalize: ensure it has the same shape as static paths
  return {
    id: pathway.id || pathId,
    title: pathway.title || 'Generated Path',
    description: pathway.description || '',
    phases: pathway.phases || [],
    status: 'active',
    isGenerated: true,
  };
}
