// ============================================================
// CampusCode — Search Hook
// ============================================================

'use client';

import { useState, useCallback, useEffect } from 'react';

export interface SearchResult {
  id: string;
  type: 'product' | 'solution' | 'student' | 'project';
  title: string;
  subtitle: string;
  url: string;
}

export function useSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setResults(data.results || []);
          }
        }
      } catch (err) {
        console.error('[useSearch] Error:', err);
      }
    }, 200);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => { setIsOpen(false); setQuery(''); setResults([]); }, []);

  return {
    query,
    setQuery,
    results,
    isOpen,
    open,
    close,
  };
}

