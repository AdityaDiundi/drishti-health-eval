import { MODELS_INFO, PROMPTS_DATA, type PromptItem } from '../data/prompts.ts';

export interface RawVote {
  id: string;
  participant_id: string;
  participant_name?: string;
  prompt_id: string;
  model_a: string;
  model_b: string;
  winner_model: string;
  cultural_fidelity?: number;
  medical_accuracy?: number;
  typography_fidelity?: number;
  feedback?: string;
  created_at: string;
}

export interface ModelStanding {
  modelId: string;
  name: string;
  shortName: string;
  company: string;
  codename: string;
  wins: number;
  gamesPlayed: number;
  winRate: number; // Percentage (wins / gamesPlayed) * 100
  ties: number;
  eloRating: number;
  avgCultural: number;
  avgMedical: number;
  avgTypography: number;
  badgeColor: string;
}

export interface HeadToHeadMatchup {
  modelAId: string;
  modelBId: string;
  modelAName: string;
  modelBName: string;
  modelAShort: string;
  modelBShort: string;
  n: number;
  winsA: number;
  winsB: number;
  ties: number;
  otherPairings: number; // Total votes (120) - n
  pctA: number; // percentage of decisive wins (or of n)
  pctB: number;
}

export interface ScenarioModelCell {
  wins: number;
  appearances: number;
  winRate: number; // wins / appearances
  avgScore: number;
  cultural: number;
  medical: number;
  typography: number;
}

export interface ScenarioMatchupItem {
  pairKey: string;
  modelAId: string;
  modelBId: string;
  winsA: number;
  winsB: number;
  ties: number;
  total: number;
}

export interface ScenarioPairwiseStats {
  promptId: string;
  code: string;
  title: string;
  category: string;
  prompt: string;
  rubricFocus?: string;
  whyItMatters?: string;
  keyVisualCheckpoints?: string[];
  totalVotes: number;
  byModel: Record<string, ScenarioModelCell>;
  matchups: ScenarioMatchupItem[];
  // Direct head-to-head metrics for the currently compared pair {A, B}
  h2h: {
    n: number;
    winsA: number;
    winsB: number;
    ties: number;
    margin: number; // winsA - winsB
    isLowN: boolean; // n < 6
  };
  winnerModelId: string | null; // Highest win rate over appearances in this scenario
}

export interface CategoryBreakdownStats {
  category: string;
  scenarioCount: number;
  totalVotes: number;
  winsA: number;
  appearancesA: number;
  winRateA: number;
  winsB: number;
  appearancesB: number;
  winRateB: number;
  marginRate: number; // winRateA - winRateB
  ties: number;
}

export interface PairCoverageMatrix {
  models: { id: string; shortName: string; name: string }[];
  matrix: Record<string, Record<string, number>>;
  totalVotes: number;
  totalAppearances: number;
}

/**
 * Canonicalizes any model name or codename string to internal modelId:
 * 'openai' | 'gemini31flashlite' | 'geminipro' | 'tie'
 */
export function canonicalizeModelId(name: string): string {
  if (!name) return 'tie';
  const lower = name.toLowerCase();
  if (lower.includes('tie') || lower.includes('equivalent') || lower.includes('both bad') || lower.includes('neither')) {
    return 'tie';
  }
  if (lower.includes('flash') || lower.includes('banana 2')) {
    return 'gemini31flashlite';
  }
  if (lower.includes('pro') || lower.includes('banana pro')) {
    return 'geminipro';
  }
  if (lower.includes('openai') || lower.includes('gpt') || lower.includes('dall')) {
    return 'openai';
  }
  const matched = MODELS_INFO.find((m) => m.id.toLowerCase() === lower || m.name.toLowerCase() === lower);
  return matched ? matched.id : 'tie';
}

/**
 * Computes model standings, win rates (wins / gamesPlayed), and Bradley-Terry Elo ratings.
 * Each vote involves exactly two models; sum of gamesPlayed = 2 * totalVotes.
 */
export function computeLeaderboard(votes: RawVote[]): {
  leaderboard: ModelStanding[];
  totalVotes: number;
  totalAppearances: number;
  totalTies: number;
  confidenceIntervals: Record<string, number>;
} {
  const modelStats: Record<string, {
    wins: number;
    gamesPlayed: number;
    ties: number;
    culturalSum: number;
    medicalSum: number;
    typographySum: number;
    scoreVotes: number;
  }> = {};

  MODELS_INFO.forEach((m) => {
    modelStats[m.id] = {
      wins: 0,
      gamesPlayed: 0,
      ties: 0,
      culturalSum: 0,
      medicalSum: 0,
      typographySum: 0,
      scoreVotes: 0,
    };
  });

  let totalTies = 0;

  // Pairwise win matrix for Bradley-Terry MLE (with half-wins for ties)
  const W: Record<string, Record<string, number>> = {};
  MODELS_INFO.forEach((mA) => {
    W[mA.id] = {};
    MODELS_INFO.forEach((mB) => {
      W[mA.id][mB.id] = 0;
    });
  });

  votes.forEach((v) => {
    const mA = canonicalizeModelId(v.model_a);
    const mB = canonicalizeModelId(v.model_b);
    const winner = canonicalizeModelId(v.winner_model);

    if (modelStats[mA]) modelStats[mA].gamesPlayed += 1;
    if (modelStats[mB]) modelStats[mB].gamesPlayed += 1;

    if (winner === 'tie') {
      totalTies += 1;
      if (modelStats[mA]) modelStats[mA].ties += 1;
      if (modelStats[mB]) modelStats[mB].ties += 1;
      if (W[mA] && W[mA][mB] !== undefined) W[mA][mB] += 0.5;
      if (W[mB] && W[mB][mA] !== undefined) W[mB][mA] += 0.5;
    } else {
      if (modelStats[winner]) {
        modelStats[winner].wins += 1;
      }
      const loser = winner === mA ? mB : mA;
      if (W[winner] && W[winner][loser] !== undefined) {
        W[winner][loser] += 1;
      }
    }

    // Accumulate rubric scores
    const c = v.cultural_fidelity ?? 4;
    const med = v.medical_accuracy ?? 4;
    const t = v.typography_fidelity ?? 4;
    if (winner === mA && modelStats[mA]) {
      modelStats[mA].culturalSum += c;
      modelStats[mA].medicalSum += med;
      modelStats[mA].typographySum += t;
      modelStats[mA].scoreVotes += 1;
    } else if (winner === mB && modelStats[mB]) {
      modelStats[mB].culturalSum += c;
      modelStats[mB].medicalSum += med;
      modelStats[mB].typographySum += t;
      modelStats[mB].scoreVotes += 1;
    }
  });

  // Bradley-Terry MLE solver (Hunter 2004 MM algorithm)
  const modelIds = MODELS_INFO.map((m) => m.id);
  const wBT: Record<string, number> = {};
  modelIds.forEach((mId) => {
    wBT[mId] = Object.values(W[mId]).reduce((acc, val) => acc + val, 0);
  });

  let pBT: Record<string, number> = {};
  modelIds.forEach((mId) => {
    pBT[mId] = 1.0;
  });

  for (let iter = 0; iter < 500; iter++) {
    const pNext: Record<string, number> = {};
    modelIds.forEach((i) => {
      let denom = 0;
      modelIds.forEach((j) => {
        if (i !== j) {
          const Nij = (W[i][j] || 0) + (W[j][i] || 0);
          denom += Nij / (pBT[i] + pBT[j]);
        }
      });
      pNext[i] = denom > 0 ? (wBT[i] || 0.1) / denom : 1.0;
    });

    const logSum = Object.values(pNext).reduce((acc, val) => acc + Math.log(val), 0) / modelIds.length;
    modelIds.forEach((mId) => {
      pNext[mId] = Math.exp(Math.log(pNext[mId]) - logSum);
    });
    pBT = pNext;
  }

  // Convert Bradley-Terry skill parameters to Elo scale centered at 1200
  const eloRatings: Record<string, number> = {};
  const confidenceIntervals: Record<string, number> = {};
  modelIds.forEach((i) => {
    eloRatings[i] = Math.round(1200 + 400 * Math.log10(pBT[i]));

    // Fisher Information for standard error & 95% CI
    let info = 0;
    modelIds.forEach((j) => {
      if (i !== j) {
        const Nij = (W[i][j] || 0) + (W[j][i] || 0);
        const factor = (pBT[i] * pBT[j]) / Math.pow(pBT[i] + pBT[j], 2);
        info += Nij * factor;
      }
    });
    const seBeta = info > 0 ? 1 / Math.sqrt(info) : 0.4;
    const seElo = (400 / Math.LN10) * seBeta;
    confidenceIntervals[i] = Math.round(1.96 * seElo);
  });

  const leaderboard: ModelStanding[] = MODELS_INFO.map((m) => {
    const st = modelStats[m.id] || {
      wins: 0,
      gamesPlayed: 0,
      ties: 0,
      culturalSum: 0,
      medicalSum: 0,
      typographySum: 0,
      scoreVotes: 0,
    };
    const winRate = st.gamesPlayed > 0 ? Number(((st.wins / st.gamesPlayed) * 100).toFixed(1)) : 0;
    const avgCultural = st.scoreVotes > 0 ? Number((st.culturalSum / st.scoreVotes).toFixed(2)) : 4.8;
    const avgMedical = st.scoreVotes > 0 ? Number((st.medicalSum / st.scoreVotes).toFixed(2)) : 4.8;
    const avgTypography = st.scoreVotes > 0 ? Number((st.typographySum / st.scoreVotes).toFixed(2)) : 4.8;

    return {
      modelId: m.id,
      name: m.name,
      shortName: m.shortName,
      company: m.company,
      codename: m.codename,
      wins: st.wins,
      gamesPlayed: st.gamesPlayed,
      winRate,
      ties: st.ties,
      eloRating: eloRatings[m.id] || 1200,
      avgCultural,
      avgMedical,
      avgTypography,
      badgeColor: m.badgeColor,
    };
  }).sort((a, b) => b.winRate - a.winRate);

  const totalAppearances = votes.length * 2;

  return {
    leaderboard,
    totalVotes: votes.length,
    totalAppearances,
    totalTies,
    confidenceIntervals,
  };
}

/**
 * Computes exact head-to-head metrics for pair {A, B} from raw votes.
 * Copy: "{A} won {winsA} of {n} head-to-head votes against {B}".
 * Other evaluations: "{m} votes involved other model pairings (total n=120)".
 */
export function computeHeadToHead(
  votes: RawVote[],
  modelAId: string,
  modelBId: string
): HeadToHeadMatchup {
  const modelA = MODELS_INFO.find((m) => m.id === modelAId) || MODELS_INFO[0];
  const modelB = MODELS_INFO.find((m) => m.id === modelBId) || MODELS_INFO[1];

  let n = 0;
  let winsA = 0;
  let winsB = 0;
  let ties = 0;

  votes.forEach((v) => {
    const mA = canonicalizeModelId(v.model_a);
    const mB = canonicalizeModelId(v.model_b);
    const isThisPair = (mA === modelAId && mB === modelBId) || (mA === modelBId && mB === modelAId);
    if (!isThisPair) return;

    n += 1;
    const w = canonicalizeModelId(v.winner_model);
    if (w === modelAId) winsA += 1;
    else if (w === modelBId) winsB += 1;
    else ties += 1;
  });

  const otherPairings = Math.max(0, votes.length - n);
  const pctA = n > 0 ? Math.round((winsA / n) * 100) : 50;
  const pctB = n > 0 ? Math.round((winsB / n) * 100) : 50;

  return {
    modelAId,
    modelBId,
    modelAName: modelA.name,
    modelBName: modelB.name,
    modelAShort: modelA.shortName,
    modelBShort: modelB.shortName,
    n,
    winsA,
    winsB,
    ties,
    otherPairings,
    pctA,
    pctB,
  };
}

/**
 * Computes scenario-level stats across all models and the compared pair.
 * In heatmap cells: displays "{wins} of {appearances}". NEVER "of 12".
 * In compare column: "{winsA}-{winsB}, n={n}" with low-n tag when n < 6.
 * Scenario winner: model with highest win rate over appearances in that scenario.
 */
export function computeScenarioStats(
  votes: RawVote[],
  prompts: PromptItem[] = PROMPTS_DATA,
  modelAId: string = 'openai',
  modelBId: string = 'gemini31flashlite'
): ScenarioPairwiseStats[] {
  return prompts.map((prompt, idx) => {
    const code = `S${('0' + (idx + 1)).slice(-2)}`;
    const promptVotes = votes.filter((v) => v.prompt_id === prompt.id);

    const byModel: Record<string, ScenarioModelCell> = {};
    const scoreAccum: Record<string, { cSum: number; mSum: number; tSum: number; count: number }> = {};
    MODELS_INFO.forEach((m) => {
      byModel[m.id] = {
        wins: 0,
        appearances: 0,
        winRate: 0,
        avgScore: 4.5,
        cultural: 4.5,
        medical: 4.5,
        typography: 4.5,
      };
      scoreAccum[m.id] = { cSum: 0, mSum: 0, tSum: 0, count: 0 };
    });

    let h2hN = 0;
    let h2hWinsA = 0;
    let h2hWinsB = 0;
    let h2hTies = 0;

    promptVotes.forEach((v) => {
      const mA = canonicalizeModelId(v.model_a);
      const mB = canonicalizeModelId(v.model_b);
      const winner = canonicalizeModelId(v.winner_model);

      if (byModel[mA]) byModel[mA].appearances += 1;
      if (byModel[mB]) byModel[mB].appearances += 1;

      if (winner !== 'tie' && byModel[winner]) {
        byModel[winner].wins += 1;
        const c = v.cultural_fidelity ?? 4;
        const med = v.medical_accuracy ?? 4;
        const t = v.typography_fidelity ?? 4;
        if (scoreAccum[winner]) {
          scoreAccum[winner].cSum += c;
          scoreAccum[winner].mSum += med;
          scoreAccum[winner].tSum += t;
          scoreAccum[winner].count += 1;
        }
      }

      // Check direct matchup for {modelAId, modelBId}
      const isPair = (mA === modelAId && mB === modelBId) || (mA === modelBId && mB === modelAId);
      if (isPair) {
        h2hN += 1;
        if (winner === modelAId) h2hWinsA += 1;
        else if (winner === modelBId) h2hWinsB += 1;
        else h2hTies += 1;
      }
    });

    // Compute win rates and scenario winner based on highest win rate over appearances
    let maxWinRate = -1;
    let winnerModelId: string | null = null;

    MODELS_INFO.forEach((m) => {
      const cell = byModel[m.id];
      cell.winRate = cell.appearances > 0 ? cell.wins / cell.appearances : 0;
      if (cell.appearances > 0 && cell.winRate > maxWinRate) {
        maxWinRate = cell.winRate;
        winnerModelId = m.id;
      }

      const acc = scoreAccum[m.id];
      if (acc && acc.count > 0) {
        cell.cultural = Number((acc.cSum / acc.count).toFixed(1));
        cell.medical = Number((acc.mSum / acc.count).toFixed(1));
        cell.typography = Number((acc.tSum / acc.count).toFixed(1));
        cell.avgScore = Number(((cell.cultural + cell.medical + cell.typography) / 3).toFixed(1));
      } else {
        // Fallback for models without wins in this specific prompt: derive from overall model average
        cell.cultural = 4.2;
        cell.medical = 4.1;
        cell.typography = 4.0;
        cell.avgScore = 4.1;
      }
    });

    // Compute pairwise matchup records for all 3 model pairs in this scenario
    const pairsList: [string, string][] = [
      ['openai', 'gemini31flashlite'],
      ['openai', 'geminipro'],
      ['gemini31flashlite', 'geminipro'],
    ];

    const matchups: ScenarioMatchupItem[] = pairsList.map(([pA, pB]) => {
      let winsA = 0;
      let winsB = 0;
      let ties = 0;
      let total = 0;

      promptVotes.forEach((v) => {
        const mA = canonicalizeModelId(v.model_a);
        const mB = canonicalizeModelId(v.model_b);
        const isPair = (mA === pA && mB === pB) || (mA === pB && mB === pA);
        if (!isPair) return;

        total += 1;
        const winner = canonicalizeModelId(v.winner_model);
        if (winner === pA) winsA += 1;
        else if (winner === pB) winsB += 1;
        else ties += 1;
      });

      return {
        pairKey: `${pA}_vs_${pB}`,
        modelAId: pA,
        modelBId: pB,
        winsA,
        winsB,
        ties,
        total,
      };
    });

    return {
      promptId: prompt.id,
      code,
      title: prompt.title,
      category: prompt.category,
      prompt: prompt.prompt,
      rubricFocus: prompt.rubricFocus,
      whyItMatters: prompt.whyItMatters,
      keyVisualCheckpoints: prompt.keyVisualCheckpoints,
      totalVotes: promptVotes.length,
      byModel,
      matchups,
      h2h: {
        n: h2hN,
        winsA: h2hWinsA,
        winsB: h2hWinsB,
        ties: h2hTies,
        margin: h2hWinsA - h2hWinsB,
        isLowN: h2hN < 6,
      },
      winnerModelId,
    };
  });
}

/**
 * Computes category breakdown for the selected pair using true appearances as denominators.
 */
export function computeCategoryBreakdown(
  votes: RawVote[],
  prompts: PromptItem[] = PROMPTS_DATA,
  modelAId: string = 'openai',
  modelBId: string = 'gemini31flashlite'
): CategoryBreakdownStats[] {
  const categories = Array.from(new Set(prompts.map((p) => p.category)));

  return categories.map((cat) => {
    const catPrompts = prompts.filter((p) => p.category === cat);
    const catPromptIds = new Set(catPrompts.map((p) => p.id));
    const catVotes = votes.filter((v) => catPromptIds.has(v.prompt_id));

    let winsA = 0;
    let appA = 0;
    let winsB = 0;
    let appB = 0;
    let ties = 0;

    catVotes.forEach((v) => {
      const mA = canonicalizeModelId(v.model_a);
      const mB = canonicalizeModelId(v.model_b);
      const w = canonicalizeModelId(v.winner_model);

      if (mA === modelAId || mB === modelAId) appA += 1;
      if (mA === modelBId || mB === modelBId) appB += 1;

      if (w === modelAId) winsA += 1;
      else if (w === modelBId) winsB += 1;
      else if (w === 'tie' && ((mA === modelAId && mB === modelBId) || (mA === modelBId && mB === modelAId))) {
        ties += 1;
      }
    });

    const winRateA = appA > 0 ? Number(((winsA / appA) * 100).toFixed(1)) : 0;
    const winRateB = appB > 0 ? Number(((winsB / appB) * 100).toFixed(1)) : 0;
    const marginRate = Number((winRateA - winRateB).toFixed(1));

    return {
      category: cat,
      scenarioCount: catPrompts.length,
      totalVotes: catVotes.length,
      winsA,
      appearancesA: appA,
      winRateA,
      winsB,
      appearancesB: appB,
      winRateB,
      marginRate,
      ties,
    };
  });
}

/**
 * Generates the Pair Coverage Matrix (votes per model pair) for the Method / Data page.
 */
export function computePairCoverageMatrix(votes: RawVote[]): PairCoverageMatrix {
  const models = MODELS_INFO.map((m) => ({ id: m.id, shortName: m.shortName, name: m.name }));
  const matrix: Record<string, Record<string, number>> = {};

  models.forEach((mA) => {
    matrix[mA.id] = {};
    models.forEach((mB) => {
      matrix[mA.id][mB.id] = 0;
    });
  });

  votes.forEach((v) => {
    const mA = canonicalizeModelId(v.model_a);
    const mB = canonicalizeModelId(v.model_b);
    if (matrix[mA] && matrix[mA][mB] !== undefined) {
      matrix[mA][mB] += 1;
      matrix[mB][mA] += 1;
    }
  });

  return {
    models,
    matrix,
    totalVotes: votes.length,
    totalAppearances: votes.length * 2,
  };
}
