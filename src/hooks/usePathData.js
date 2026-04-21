import { useState, useEffect } from 'react';
import { getPath } from '../data/paths';

/**
 * Custom hook to load path data — checks static paths first, 
 * then fetches from API for AI-generated paths.
 * 
 * @param {string} pathId - The path identifier
 * @returns {{ path: object|null, loading: boolean, error: string|null }}
 */
export function usePathData(pathId) {
  const [path, setPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await getPath(pathId);

        if (cancelled) return;

        if (!result) {
          setError('Path not found');
          setPath(null);
        } else {
          setPath(result);
        }
      } catch (err) {
        if (cancelled) return;
        console.error('[usePathData] Error loading path:', err);
        setError(err.message || 'Failed to load path');
        setPath(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (pathId) {
      load();
    } else {
      setLoading(false);
      setError('No path ID provided');
    }

    return () => {
      cancelled = true;
    };
  }, [pathId]);

  return { path, loading, error };
}
