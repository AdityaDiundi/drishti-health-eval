import { NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabase';
import { PROMPTS_DATA, MODELS_INFO } from '@/data/prompts';
import staticManifest from '@/data/database_manifest.json';

// In-memory fallback if custom Supabase tables are pending schema creation
let memoryParticipants: any[] = [];
let memoryRatings: any[] = [];

export async function GET() {
  const adminSupabase = getAdminSupabase();
  let ratings = [...memoryRatings];
  let participants = [...memoryParticipants];

  try {
    // Attempt reading from Supabase
    const { data: dbRatings, error: rErr } = await adminSupabase.from('eval_ratings').select('*');
    if (!rErr && dbRatings && dbRatings.length > 0) {
      ratings = dbRatings;
    }
    const { data: dbParticipants, error: pErr } = await adminSupabase.from('eval_participants').select('*');
    if (!pErr && dbParticipants && dbParticipants.length > 0) {
      participants = dbParticipants;
    }
  } catch (err) {
    console.warn('Using memory ratings store:', err);
  }

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
    if (modelStats[r.winner_model]) {
      modelStats[r.winner_model].wins += 1;
    }
    const countKey = r.winner_model || Object.keys(modelStats)[0];
    if (modelStats[countKey]) {
      modelStats[countKey].totalRounds += 1;
      modelStats[countKey].culturalSum += (r.cultural_fidelity || 4);
      modelStats[countKey].medicalSum += (r.medical_accuracy || 4);
      modelStats[countKey].typographySum += (r.typography_fidelity || 4);
      modelStats[countKey].voteCount += 1;
    }
  });

  const totalVotes = ratings.length;
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
    totalParticipants: participants.length,
    recentRatings: ratings.slice(-10),
    prompts: PROMPTS_DATA,
    imagesManifest: staticManifest,
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

    // Also attempt saving to Supabase if tables exist
    const adminSupabase = getAdminSupabase();
    try {
      await adminSupabase.from('eval_participants').insert([newParticipant]);
      await adminSupabase.from('eval_ratings').insert(formattedRatings);
    } catch (dbErr) {
      console.warn('Note: Stored in memory backend. Supabase table write notice:', dbErr);
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
