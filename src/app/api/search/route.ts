// ============================================================
// CampusCode — Search API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { products, solutionRequests, students, projects } from '@/lib/mock-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase();
  const type = searchParams.get('type'); // product, solution, student, project

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [], total: 0 });
  }

  const results: { id: string; type: string; title: string; subtitle: string; url: string }[] = [];

  if (!type || type === 'product') {
    products.forEach((p) => {
      if (p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)) {
        results.push({
          id: p.id, type: 'product', title: p.name,
          subtitle: `${p.category} • ${p.isFree ? 'Free' : `₹${p.price}`}`,
          url: `/marketplace/${p.id}`,
        });
      }
    });
  }

  if (!type || type === 'solution') {
    solutionRequests.forEach((sr) => {
      if (sr.title.toLowerCase().includes(query) || sr.description.toLowerCase().includes(query)) {
        results.push({
          id: sr.id, type: 'solution', title: sr.title,
          subtitle: `${sr.category} • ${sr.proposalCount} proposals`,
          url: `/solutions/${sr.id}`,
        });
      }
    });
  }

  if (!type || type === 'student') {
    students.forEach((s) => {
      if (s.name.toLowerCase().includes(query) || s.studentProfile?.skills.some((sk) => sk.toLowerCase().includes(query))) {
        results.push({
          id: s.id, type: 'student', title: s.name,
          subtitle: s.studentProfile?.college || s.role,
          url: `/portfolio/${s.studentProfile?.portfolioUrl || s.id}`,
        });
      }
    });
  }

  if (!type || type === 'project') {
    projects.forEach((p) => {
      if (p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)) {
        results.push({
          id: p.id, type: 'project', title: p.name,
          subtitle: `${p.status} • ${p.progress}%`,
          url: `/projects/${p.id}`,
        });
      }
    });
  }

  return NextResponse.json({ results: results.slice(0, 20), total: results.length });
}
