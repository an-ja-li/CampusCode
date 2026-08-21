// ============================================================
// CampusCode — Search Hook
// ============================================================

'use client';

import { useState, useCallback, useMemo } from 'react';
import { products, solutionRequests, students, projects } from '@/lib/mock-data';

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

  const results = useMemo<SearchResult[]>(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    const matches: SearchResult[] = [];

    // Search products
    products.forEach((p) => {
      if (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
        matches.push({
          id: p.id,
          type: 'product',
          title: p.name,
          subtitle: `${p.category} • ${p.isFree ? 'Free' : `₹${p.price}`}`,
          url: `/marketplace/${p.id}`,
        });
      }
    });

    // Search solution requests
    solutionRequests.forEach((sr) => {
      if (sr.title.toLowerCase().includes(q) || sr.description.toLowerCase().includes(q)) {
        matches.push({
          id: sr.id,
          type: 'solution',
          title: sr.title,
          subtitle: `${sr.category} • ${sr.proposalCount} proposals`,
          url: `/solutions/${sr.id}`,
        });
      }
    });

    // Search students
    students.forEach((s) => {
      if (s.name.toLowerCase().includes(q) || s.studentProfile?.skills.some((sk) => sk.toLowerCase().includes(q))) {
        matches.push({
          id: s.id,
          type: 'student',
          title: s.name,
          subtitle: s.studentProfile?.college || s.role,
          url: `/portfolio/${s.studentProfile?.portfolioUrl || s.id}`,
        });
      }
    });

    // Search projects
    projects.forEach((p) => {
      if (p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)) {
        matches.push({
          id: p.id,
          type: 'project',
          title: p.name,
          subtitle: `${p.status} • ${p.progress}%`,
          url: `/projects/${p.id}`,
        });
      }
    });

    return matches.slice(0, 10);
  }, [query]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => { setIsOpen(false); setQuery(''); }, []);

  return {
    query,
    setQuery,
    results,
    isOpen,
    open,
    close,
  };
}
