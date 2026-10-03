import { NextResponse } from 'next/server';
import { getAdminSupabase, supabase } from '@/lib/supabase';
import { PROMPTS_DATA, MODELS_INFO } from '@/data/prompts';
import staticManifest from '@/data/database_manifest.json';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// In-memory fallback if custom Supabase tables are pending schema creation
let memoryParticipants: any[] = [];
let memoryRatings: any[] = [];

export async function GET() {
  const adminSupabase = getAdminSupabase();
  let ratings = [...memoryRatings];
  let participants = [...memoryParticipants];

  try {
    // Attempt reading from Supabase using admin client first
    let dbRatings: any[] | null = null;
    let rErr: any = null;

    const res = await adminSupabase.from('eval_ratings').select('*');
    dbRatings = res.data;
    rErr = res.error;

    // If admin failed, try with public client
    if (rErr) {
      console.warn('Admin Supabase read error, falling back to anon client:', rErr.message);
      const fallbackRes = await supabase.from('eval_ratings').select('*');
      if (!fallbackRes.error && fallbackRes.data) {
        dbRatings = fallbackRes.data;
        rErr = null;
      }
    }

    if (!rErr && dbRatings && dbRatings.length > 0) {
      ratings = dbRatings;
    }

    let dbParticipants: any[] | null = null;
    let pErr: any = null;

    const pRes = await adminSupabase.from('eval_participants').select('*');
    dbParticipants = pRes.data;
    pErr = pRes.error;

    if (pErr) {
      const fallbackP = await supabase.from('eval_participants').select('*');
      if (!fallbackP.error && fallbackP.data) {
        dbParticipants = fallbackP.data;
        pErr = null;
      }
    }

    if (!pErr && dbParticipants && dbParticipants.length > 0) {
      participants = dbParticipants;
    }
  } catch (err: any) {
    console.warn('Using memory ratings store fallback:', err.message);
  }

  // Canonicalize model names so database names (e.g. including codenames) map to MODELS_INFO correctly
  const canonicalizeModel = (name: string): string => {
    if (!name) return '';
    const lower = name.toLowerCase();
    if (lower.includes('flash') || lower.includes('banana 2')) {
      return 'Google Gemini 3.1 Flash Image Preview';
    }
    if (lower.includes('pro') || lower.includes('banana pro')) {
      return 'Google Gemini 3 Pro Image Preview';
    }
    if (lower.includes('openai') || lower.includes('gpt') || lower.includes('dall')) {
      return 'OpenAI GPT Image 1';
    }
    const matched = MODELS_INFO.find((m) => m.name.toLowerCase() === lower || m.id.toLowerCase() === lower);
    return matched ? matched.name : name;
  };

  // Calculate Win Rates & Elo
  const modelStats: Record<string, {
    wins: number;
    totalRounds: number;
    culturalSum: number;
    medicalSum: number;
    typographySum: number;
    voteCount: number;
  }> = {};

  MODELS_INFO.forEach((m) => {
    modelStats[m.name] = { wins: 0, totalRounds: 0, culturalSum: 0, medicalSum: 0, typographySum: 0, voteCount: 0 };
  });

  ratings.forEach((r) => {
    const canonicalKey = canonicalizeModel(r.winner_model);
    if (modelStats[canonicalKey]) {
      modelStats[canonicalKey].wins += 1;
      modelStats[canonicalKey].totalRounds += 1;
      modelStats[canonicalKey].culturalSum += (r.cultural_fidelity || 4);
      modelStats[canonicalKey].medicalSum += (r.medical_accuracy || 4);
      modelStats[canonicalKey].typographySum += (r.typography_fidelity || 4);
      modelStats[canonicalKey].voteCount += 1;
    }
  });

  const totalVotes = ratings.length;
  const uniqueEvaluatorsFromRatings = new Set(
    ratings.map((r: any) => r.participant_id || r.participant_name).filter(Boolean)
  ).size;
  const totalEvaluators = Math.max(participants.length, uniqueEvaluatorsFromRatings);

  const leaderboard = MODELS_INFO.map((m) => {
    const stats = modelStats[m.name] || { wins: 0, totalRounds: 0, culturalSum: 0, medicalSum: 0, typographySum: 0, voteCount: 0 };
    const winRate = totalVotes > 0 ? Number(((stats.wins / totalVotes) * 100).toFixed(1)) : 0;
    const avgCultural = stats.voteCount > 0 ? Number((stats.culturalSum / stats.voteCount).toFixed(2)) : 0;
    const avgMedical = stats.voteCount > 0 ? Number((stats.medicalSum / stats.voteCount).toFixed(2)) : 0;
    const avgTypography = stats.voteCount > 0 ? Number((stats.typographySum / stats.voteCount).toFixed(2)) : 0;
    const eloRating = totalVotes > 0 ? Math.round(1200 + (winRate - 33.33) * 12) : 1200;

    return {
      modelId: m.id,
      name: m.name,
      shortName: m.shortName,
      company: m.company,
      codename: m.codename,
      wins: stats.wins,
      winRate: winRate,
      eloRating: eloRating,
      avgCultural: avgCultural,
      avgMedical: avgMedical,
      avgTypography: avgTypography,
      badgeColor: m.badgeColor,
    };
  }).sort((a, b) => b.winRate - a.winRate);

  return NextResponse.json({
    leaderboard,
    totalRatings: ratings.length,
    totalParticipants: totalEvaluators,
    recentRatings: ratings.slice(-10),
    prompts: PROMPTS_DATA,
    imagesManifest: staticManifest,
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { participant, ratings } = body;

    if (!participant || !participant.name || !participant.email || !ratings || !Array.isArray(ratings)) {
      return NextResponse.json({ error: 'Missing required participant or ratings payload' }, { status: 400 });
    }

    const participantId = `p-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newParticipant = {
      id: participantId,
      name: participant.name,
      email: participant.email,
      age: Number(participant.age) || 25,
      consent_given: true,
      created_at: new Date().toISOString(),
    };
    memoryParticipants.push(newParticipant);

    const formattedRatings = ratings.map((r: any) => ({
      id: `r-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      participant_id: participantId,
      participant_name: participant.name,
      prompt_id: r.prompt_id,
      winner_model: r.winner_model,
      cultural_fidelity: Number(r.cultural_fidelity) || 4,
      medical_accuracy: Number(r.medical_accuracy) || 4,
      typography_fidelity: Number(r.typography_fidelity) || 4,
      feedback: r.feedback || '',
      created_at: new Date().toISOString(),
    }));

    memoryRatings.push(...formattedRatings);

    // Save to Supabase
    const adminSupabase = getAdminSupabase();
    try {
      let { error: pErr } = await adminSupabase.from('eval_participants').upsert([newParticipant]);
      if (pErr) {
        console.warn('Admin Supabase participant write error, trying anon client:', pErr.message);
        const fb = await supabase.from('eval_participants').upsert([newParticipant]);
        pErr = fb.error;
      }
      if (pErr) console.error('Supabase participant write error:', pErr.message);
      
      let { error: rErr } = await adminSupabase.from('eval_ratings').insert(formattedRatings);
      if (rErr) {
        console.warn('Admin Supabase ratings write error, trying anon client:', rErr.message);
        const fb = await supabase.from('eval_ratings').insert(formattedRatings);
        rErr = fb.error;
      }
      if (rErr) console.error('Supabase ratings write error:', rErr.message);
    } catch (dbErr: any) {
      console.warn('Supabase DB connection notice:', dbErr.message);
    }

    return NextResponse.json({
      success: true,
      participantId,
      count: formattedRatings.length,
      message: 'Evaluation saved successfully',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to submit ratings' }, { status: 500 });
  }
}
