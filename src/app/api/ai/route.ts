// ============================================================
// CampusCode — AI API Route
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { aiService } from '@/services/ai';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action, ...data } = body;

  switch (action) {
    case 'project_plan': {
      const plan = await aiService.generateProjectPlan(data.description);
      return NextResponse.json({ plan });
    }
    case 'analyze_requirement': {
      const analysis = await aiService.analyzeRequirement(data.description, data.features || []);
      return NextResponse.json({ analysis });
    }
    case 'suggest_proposal': {
      const suggestion = await aiService.suggestProposal(data.description, data.skills || []);
      return NextResponse.json({ suggestion });
    }
    case 'match_student': {
      const match = await aiService.matchStudentToRequest(data.studentSkills || [], data.requestTech || []);
      return NextResponse.json({ match });
    }
    case 'optimize_listing': {
      const optimization = await aiService.optimizeListing(data.title, data.description, data.technologies || []);
      return NextResponse.json({ optimization });
    }
    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}
