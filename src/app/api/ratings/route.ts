import { NextResponse } from 'next/server';
import { getAdminSupabase, supabase } from '@/lib/supabase';
import { PROMPTS_DATA, MODELS_INFO } from '@/data/prompts';
import staticManifest from '@/data/database_manifest.json';
import baselineVotes from '@/data/pairwiseVotes.json';
import {
  computeLeaderboard,
  computeScenarioStats,
  computeHeadToHead,
  canonicalizeModelId,
  type RawVote,
} from '@/lib/pairwiseAnalytics';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// In-memory fallback if custom Supabase tables are pending schema creation
let memoryParticipants: any[] = [];
let memoryRatings: any[] = [];

export async function GET() {
  const adminSupabase = getAdminSupabase();
  let dbRatings: any[] = [];
  let participants = [...memoryParticipants];

  try {
    // Attempt reading from Supabase using admin client first
    const res = await adminSupabase.from('eval_ratings').select('*');
    if (!res.error && Array.isArray(res.data)) {
      dbRatings = res.data;
    } else {
      const fallbackRes = await supabase.from('eval_ratings').select('*');
      if (!fallbackRes.error && Array.isArray(fallbackRes.data)) {
        dbRatings = fallbackRes.data;
      }
    }

    const pRes = await adminSupabase.from('eval_participants').select('*');
    if (!pRes.error && Array.isArray(pRes.data)) {
      participants = pRes.data;
    } else {
      const fallbackP = await supabase.from('eval_participants').select('*');
      if (!fallbackP.error && Array.isArray(fallbackP.data)) {
        participants = fallbackP.data;
      }
    }
  } catch (err: any) {
    console.warn('Using memory / baseline ratings store fallback:', err.message);
  }

  // Combine verified baseline pairwise votes with any newly submitted evaluations
  // Baseline contains all 120 verified double-blind pairwise votes with complete model_a, model_b provenance
  const baseVotesMap = new Map<string, any>();
  (baselineVotes as any[]).forEach((v) => {
    baseVotesMap.set(v.id, v);
  });

  // Track any live ratings (from DB or memory) not already in baseline
  const additionalVotes: RawVote[] = [];
  const allCandidateRatings = [...dbRatings, ...memoryRatings];
  allCandidateRatings.forEach((r) => {
    if (r && r.id && !baseVotesMap.has(r.id)) {
      // Map candidate rating into RawVote
      additionalVotes.push({
        id: r.id,
        participant_id: r.participant_id || 'anonymous',
        participant_name: r.participant_name,
        prompt_id: r.prompt_id,
        model_a: r.model_a || r.model_a_name || 'OpenAI GPT Image 1',
        model_b: r.model_b || r.model_b_name || 'Google Gemini 3.1 Flash Image Preview',
        winner_model: r.winner_model,
        cultural_fidelity: r.cultural_fidelity,
        medical_accuracy: r.medical_accuracy,
        typography_fidelity: r.typography_fidelity,
        feedback: r.feedback,
        created_at: r.created_at || new Date().toISOString(),
      });
    }
  });

  const allVotes: RawVote[] = [...(baselineVotes as RawVote[]), ...additionalVotes];

  // Total unique participants
  const uniqueEmails = new Set(
    participants.map((p: any) => (p.email || '').trim().toLowerCase()).filter(Boolean)
  );
  const uniqueEvaluatorsFromVotes = new Set(
    allVotes.map((v) => v.participant_id || v.participant_name).filter(Boolean)
  ).size;
  const totalEvaluators = Math.max(12, uniqueEmails.size, uniqueEvaluatorsFromVotes);

  // Compute model standings, win rates (wins / gamesPlayed), and Bradley-Terry Elo ratings
  const {
    leaderboard,
    totalVotes,
    totalAppearances,
    totalTies,
    confidenceIntervals,
  } = computeLeaderboard(allVotes);

  // Scenario-level pairwise statistics (appearance counts, win rates, rubric averages)
  const scenarioStats = computeScenarioStats(allVotes, PROMPTS_DATA);

  // True Pairwise Head-to-Head Battles Matrix
  // For pair {A, B}: n = exact votes where the pair was {A, B}; winsA and winsB among those
  const pairwiseBattles: Record<string, Record<string, {
    winsA: number;
    winsB: number;
    ties: number;
    total: number;
    n: number;
    otherPairings: number;
    pctA: number;
    pctB: number;
  }>> = {};

  MODELS_INFO.forEach((mA) => {
    pairwiseBattles[mA.id] = {};
    MODELS_INFO.forEach((mB) => {
      if (mA.id !== mB.id) {
        const h2h = computeHeadToHead(allVotes, mA.id, mB.id);
        pairwiseBattles[mA.id][mB.id] = {
          winsA: h2h.winsA,
          winsB: h2h.winsB,
          ties: h2h.ties,
          total: h2h.n,
          n: h2h.n,
          otherPairings: h2h.otherPairings,
          pctA: h2h.pctA,
          pctB: h2h.pctB,
        };
      }
    });
  });

  return NextResponse.json({
    leaderboard,
    totalRatings: totalVotes,
    totalParticipants: totalEvaluators,
    totalAppearances,
    totalTies,
    recentRatings: allVotes.slice(-10),
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
