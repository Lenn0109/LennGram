'use client';

import { useEffect } from 'react';

interface ViewTrackerProps {
  projectId: string;
}

export function ViewTracker({ projectId }: ViewTrackerProps) {
  useEffect(() => {
    let cancelled = false;

    fetch('/api/view', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ projectId }),
    }).catch(() => {
      if (!cancelled) {
        // Silent: view tracking is best-effort.
      }
    });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  return null;
}
