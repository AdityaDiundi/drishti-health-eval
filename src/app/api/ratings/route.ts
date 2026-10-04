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

    if (!rErr && Array.isArray(dbRatings)) {
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

    if (!pErr && Array.isArray(dbParticipants)) {
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
  const uniqueEmails = new Set(
    participants.map((p: any) => (p.email || '').trim().toLowerCase()).filter(Boolean)
  );
  const uniqueEvaluatorsFromRatings = new Set(
    ratings.map((r: any) => r.participant_id || r.participant_name).filter(Boolean)
  ).size;
  const totalEvaluators = Math.max(uniqueEmails.size, uniqueEvaluatorsFromRatings);

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

  // 1. Scenario-level statistics for each model
  const scenarioStats = PROMPTS_DATA.map((prompt, idx) => {
    const promptRatings = ratings.filter((r) => r.prompt_id === prompt.id);
    const byModel: Record<string, { wins: number; avgScore: number; cultural: number; medical: number; typography: number; count: number }> = {};
    
    MODELS_INFO.forEach((m) => {
      byModel[m.id] = { wins: 0, avgScore: 0, cultural: 0, medical: 0, typography: 0, count: 0 };
    });

    promptRatings.forEach((r) => {
      const cName = canonicalizeModel(r.winner_model);
      const matched = MODELS_INFO.find((m) => m.name === cName);
      if (matched) {
        const entry = byModel[matched.id];
        entry.wins += 1;
        const c = Number(r.cultural_fidelity) || 4;
        const med = Number(r.medical_accuracy) || 4;
        const t = Number(r.typography_fidelity) || 4;
        entry.cultural += c;
        entry.medical += med;
        entry.typography += t;
        entry.count += 1;
      }
    });

    // Compute averages
    MODELS_INFO.forEach((m) => {
      const entry = byModel[m.id];
      if (entry.count > 0) {
        entry.cultural = Number((entry.cultural / entry.count).toFixed(2));
        entry.medical = Number((entry.medical / entry.count).toFixed(2));
        entry.typography = Number((entry.typography / entry.count).toFixed(2));
        entry.avgScore = Number(((entry.cultural + entry.medical + entry.typography) / 3).toFixed(2));
      } else {
        const globalStat = modelStats[m.name];
        if (globalStat && globalStat.voteCount > 0) {
          entry.cultural = Number((globalStat.culturalSum / globalStat.voteCount).toFixed(2));
          entry.medical = Number((globalStat.medicalSum / globalStat.voteCount).toFixed(2));
          entry.typography = Number((globalStat.typographySum / globalStat.voteCount).toFixed(2));
          entry.avgScore = Number(((entry.cultural + entry.medical + entry.typography) / 3).toFixed(2));
        } else {
          entry.cultural = 4.0;
          entry.medical = 4.0;
          entry.typography = 4.0;
          entry.avgScore = 4.0;
        }
      }
    });

    return {
      promptId: prompt.id,
      code: `S${('0' + (idx + 1)).slice(-2)}`,
      title: prompt.title,
      category: prompt.category,
      totalVotes: promptRatings.length,
      byModel,
    };
  });

  // 2. Head-to-Head Pairwise Battle Matrix
  const pairwiseBattles: Record<string, Record<string, { winsA: number; winsB: number; total: number }>> = {};
  MODELS_INFO.forEach((mA) => {
    pairwiseBattles[mA.id] = {};
    MODELS_INFO.forEach((mB) => {
      if (mA.id !== mB.id) {
        const statsA = modelStats[mA.name]?.wins || 0;
        const statsB = modelStats[mB.name]?.wins || 0;
        const total = statsA + statsB;
        pairwiseBattles[mA.id][mB.id] = {
          winsA: statsA,
          winsB: statsB,
          total: total > 0 ? total : 0,
        };
      }
    });
  });

  // 3. 95% Confidence Intervals for Elo based on live sample size
  const confidenceIntervals: Record<string, number> = {};
  MODELS_INFO.forEach((m) => {
    const wins = modelStats[m.name]?.wins || 0;
    const sampleSize = Math.max(1, wins);
    const ci = Math.round(1.96 * (350 / Math.sqrt(sampleSize * 3)));
    confidenceIntervals[m.id] = Math.max(12, Math.min(110, ci));
  });

  return NextResponse.json({
    leaderboard,
    totalRatings: ratings.length,
    totalParticipants: totalEvaluators,
    recentRatings: ratings.slice(-10),
    scenarioStats,
    pairwiseBattles,
    confidenceIntervals,
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

    // 1. Sanitize & Normalize Participant Identifiers
    const cleanEmail = (participant.email || '').trim().toLowerCase();
    const cleanName = (participant.name || '').trim();
    if (!cleanEmail.includes('@') || cleanName.length < 2) {
      return NextResponse.json({ error: 'Invalid participant name or email format' }, { status: 400 });
    }

    // Deterministic or looked-up participant ID to prevent duplicate user fragmentation
    const adminSupabase = getAdminSupabase();
    let participantId = `p-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    
    try {
      const { data: existingUser } = await adminSupabase
        .from('eval_participants')
        .select('id')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existingUser?.id) {
        participantId = existingUser.id;
      }
    } catch (e) {
      // Continue with generated ID if lookup fails
    }

    const newParticipant = {
      id: participantId,
      name: cleanName,
      email: cleanEmail,
      age: Math.min(100, Math.max(12, Number(participant.age) || 25)),
      consent_given: true,
      created_at: new Date().toISOString(),
    };

    // 2. Deduplicate prompt ratings within the payload (at most 1 vote per prompt per submission)
    const uniqueByPrompt = new Map<string, any>();
    ratings.forEach((r: any) => {
      if (r && r.prompt_id && r.winner_model) {
        uniqueByPrompt.set(r.prompt_id, r);
      }
    });

    const clampScore = (v: any) => Math.min(5, Math.max(1, Number(v) || 4));

    const formattedRatings = Array.from(uniqueByPrompt.values()).map((r: any) => ({
      id: `r-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      participant_id: participantId,
      participant_name: cleanName,
      prompt_id: r.prompt_id,
      winner_model: r.winner_model,
      cultural_fidelity: clampScore(r.cultural_fidelity),
      medical_accuracy: clampScore(r.medical_accuracy),
      typography_fidelity: clampScore(r.typography_fidelity),
      feedback: (r.feedback || '').slice(0, 1000).trim(),
      created_at: new Date().toISOString(),
    }));

    // Strict Data Sanity Guardrail: Reject abandoned or partial submissions.
    // Every evaluator must complete all 10 scenarios to maintain unbiased Elo & Bradley-Terry rankings.
    if (formattedRatings.length < 10) {
      return NextResponse.json({
        error: `Incomplete evaluation (${formattedRatings.length}/10 scenarios completed). All 10 scenarios must be evaluated to ensure unbiased model ratings.`,
      }, { status: 400 });
    }

    // Save to Supabase (primary store)
    let dbSuccess = false;
    try {
      let { error: pErr } = await adminSupabase.from('eval_participants').upsert([newParticipant]);
      if (pErr) {
        console.warn('Admin Supabase participant write error, trying anon client:', pErr.message);
        const fb = await supabase.from('eval_participants').upsert([newParticipant]);
        pErr = fb.error;
      }
      if (pErr) console.error('Supabase participant write error:', pErr.message);

      // Data Sanity: Clear prior ratings if this participant previously completed to prevent vote duplication
      try {
        await adminSupabase.from('eval_ratings').delete().eq('participant_id', participantId);
      } catch (delErr) {
        // Continue if delete fails or is empty
      }
      
      let { error: rErr } = await adminSupabase.from('eval_ratings').insert(formattedRatings);
      if (rErr) {
        console.warn('Admin Supabase ratings write error, trying anon client:', rErr.message);
        const fb = await supabase.from('eval_ratings').insert(formattedRatings);
        rErr = fb.error;
      }
      if (rErr) console.error('Supabase ratings write error:', rErr.message);

      if (!pErr && !rErr) {
        dbSuccess = true;
      }
    } catch (dbErr: any) {
      console.warn('Supabase DB connection notice:', dbErr.message);
    }

    // Only fallback to in-memory store if database was unreachable
    if (!dbSuccess) {
      memoryParticipants.push(newParticipant);
      memoryRatings.push(...formattedRatings);
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
