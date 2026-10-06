import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read raw pairwise votes
const rawVotesPath = path.join(__dirname, '../src/data/pairwiseVotes.json');
const rawVotes = JSON.parse(fs.readFileSync(rawVotesPath, 'utf8'));

// Import analytics methods
import {
  canonicalizeModelId,
  computeLeaderboard,
  computeHeadToHead,
  computeScenarioStats,
  computeCategoryBreakdown,
  computePairCoverageMatrix,
} from '../src/lib/pairwiseAnalytics.ts';

test('pairwise analytics: total votes and appearances reconciliation', () => {
  const { leaderboard, totalVotes, totalAppearances, totalTies } = computeLeaderboard(rawVotes);

  // Exactly 120 total pairwise votes
  assert.equal(totalVotes, 120, 'Total votes must equal 120');

  // Each vote compares exactly 2 models, so total appearances across models = 240
  assert.equal(totalAppearances, 240, 'Total appearances must equal 240 (2 * 120)');

  // Sum of individual model gamesPlayed must equal 240
  const sumGamesPlayed = leaderboard.reduce((sum, m) => sum + (m.gamesPlayed || 0), 0);
  assert.equal(sumGamesPlayed, 240, 'Sum of gamesPlayed across models must equal 240');

  // Each model played exactly 80 games in a balanced 3-model design
  leaderboard.forEach((m) => {
    assert.equal(m.gamesPlayed, 80, `Model ${m.modelId} should have exactly 80 appearances`);
  });

  // Reconcile wins and ties: 56 + 36 + 23 = 115 decisive votes + 5 ties = 120 total votes
  const sumWins = leaderboard.reduce((sum, m) => sum + m.wins, 0);
  assert.equal(sumWins, 115, 'Total decisive wins must equal 115');
  assert.equal(totalTies, 5, 'Total ties must equal 5');
  assert.equal(sumWins + totalTies, 120, 'Wins + ties must reconcile to 120 total votes');
});

test('pairwise analytics: standings win rate calculations', () => {
  const { leaderboard } = computeLeaderboard(rawVotes);

  const openai = leaderboard.find((m) => m.modelId === 'openai');
  const flash = leaderboard.find((m) => m.modelId === 'gemini31flashlite');
  const pro = leaderboard.find((m) => m.modelId === 'geminipro');

  assert.ok(openai && flash && pro);

  // Win rate = wins / gamesPlayed
  // OpenAI: 56 / 80 = 70.0%
  assert.equal(openai.wins, 56);
  assert.equal(openai.winRate, 70.0);

  // Gemini Flash: 36 / 80 = 45.0%
  assert.equal(flash.wins, 36);
  assert.equal(flash.winRate, 45.0);

  // Gemini Pro: 23 / 80 = 28.7% (or 28.8% rounded)
  assert.equal(pro.wins, 23);
  assert.equal(Math.round(pro.winRate), 29);
});

test('pairwise analytics: head-to-head battles and pair coverage matrix', () => {
  // Hand-verify 2 model pairs
  // Pair 1: {OpenAI, Gemini 3.1 Flash}
  const h2hOpenaiFlash = computeHeadToHead(rawVotes, 'openai', 'gemini31flashlite');
  assert.equal(h2hOpenaiFlash.n, 40, 'OpenAI vs Flash must have n=40 direct pairwise battles');
  assert.equal(h2hOpenaiFlash.winsA, 23, 'OpenAI won 23 head-to-head battles against Flash');
  assert.equal(h2hOpenaiFlash.winsB, 15, 'Flash won 15 head-to-head battles against OpenAI');
  assert.equal(h2hOpenaiFlash.ties, 2, 'There are 2 ties between OpenAI and Flash');
  assert.equal(h2hOpenaiFlash.otherPairings, 80, '80 votes involved other model pairings');

  // Pair 2: {OpenAI, Gemini 3 Pro}
  const h2hOpenaiPro = computeHeadToHead(rawVotes, 'openai', 'geminipro');
  assert.equal(h2hOpenaiPro.n, 40, 'OpenAI vs Pro must have n=40 direct pairwise battles');
  assert.equal(h2hOpenaiPro.winsA, 33, 'OpenAI won 33 head-to-head battles against Pro');
  assert.equal(h2hOpenaiPro.winsB, 7, 'Pro won 7 head-to-head battles against OpenAI');
  assert.equal(h2hOpenaiPro.ties, 0, 'There are 0 ties between OpenAI and Pro');
  assert.equal(h2hOpenaiPro.otherPairings, 80, '80 votes involved other model pairings');

  // Pair 3: {Gemini 3.1 Flash, Gemini 3 Pro}
  const h2hFlashPro = computeHeadToHead(rawVotes, 'gemini31flashlite', 'geminipro');
  assert.equal(h2hFlashPro.n, 40, 'Flash vs Pro must have n=40 direct pairwise battles');
  assert.equal(h2hFlashPro.winsA, 21, 'Flash won 21 head-to-head battles against Pro');
  assert.equal(h2hFlashPro.winsB, 16, 'Pro won 16 head-to-head battles against Flash');
  assert.equal(h2hFlashPro.ties, 3, 'There are 3 ties between Flash and Pro');

  // Verify pair coverage matrix
  const matrixObj = computePairCoverageMatrix(rawVotes);
  assert.equal(matrixObj.models.length, 3);
  assert.equal(matrixObj.totalVotes, 120, 'Coverage matrix votes must sum to 120');
  assert.equal(matrixObj.totalAppearances, 240, 'Coverage matrix appearances must sum to 240');
  assert.equal(matrixObj.matrix.openai.gemini31flashlite, 40, 'OpenAI vs Flash matrix cell must be 40');
  assert.equal(matrixObj.matrix.openai.geminipro, 40, 'OpenAI vs Pro matrix cell must be 40');
  assert.equal(matrixObj.matrix.gemini31flashlite.geminipro, 40, 'Flash vs Pro matrix cell must be 40');
});

test('pairwise analytics: hand-verify 3 scenarios against raw votes data', () => {
  const scenarioStats = computeScenarioStats(rawVotes);

  // Scenario 1: S01 (prompt P01)
  const s01 = scenarioStats.find((s) => s.code === 'S01');
  assert.ok(s01, 'S01 must exist');
  assert.equal(s01.totalVotes, 12, 'S01 must have 12 total prompt votes');
  // Model appearances in S01:
  // OpenAI appears in Pair 0 and Pair 1 = 4 + 4 = 8 appearances
  assert.equal(s01.byModel.openai.appearances, 8);
  assert.equal(s01.byModel.gemini31flashlite.appearances, 8);
  assert.equal(s01.byModel.geminipro.appearances, 8);
  // Total model appearances in S01 = 8 + 8 + 8 = 24 = 2 * 12
  assert.equal(
    s01.byModel.openai.appearances + s01.byModel.gemini31flashlite.appearances + s01.byModel.geminipro.appearances,
    24
  );
  // S01 direct H2H between OpenAI and Flash: n = 4, low-n badge active (n < 6)
  assert.equal(s01.h2h.n, 4);
  assert.equal(s01.h2h.isLowN, true, 'n=4 is < 6, low-n flag must be true');

  // Scenario 2: S02 (prompt P02)
  const s02 = scenarioStats.find((s) => s.code === 'S02');
  assert.ok(s02, 'S02 must exist');
  assert.equal(s02.totalVotes, 12);
  assert.equal(s02.byModel.openai.appearances, 8);
  assert.equal(s02.byModel.gemini31flashlite.appearances, 8);
  assert.equal(s02.byModel.geminipro.appearances, 8);

  // Scenario 3: S03 (prompt P03)
  const s03 = scenarioStats.find((s) => s.code === 'S03');
  assert.ok(s03, 'S03 must exist');
  assert.equal(s03.totalVotes, 12);
  // Wins in S03 sum to <= 12
  const s03Wins = s03.byModel.openai.wins + s03.byModel.gemini31flashlite.wins + s03.byModel.geminipro.wins;
  assert.ok(s03Wins <= 12);
  assert.equal(s03.h2h.isLowN, true, 'Direct H2H in scenario has n < 6');
});

test('pairwise analytics: verify 3 scenarios matchups pairwise consistency and reconciliation', () => {
  const scenarioStats = computeScenarioStats(rawVotes);

  ['S01', 'S02', 'S03'].forEach((code) => {
    const sc = scenarioStats.find((s) => s.code === code);
    assert.ok(sc, `${code} must exist`);
    assert.equal(sc.matchups.length, 3, `${code} must have exactly 3 model pair matchups`);

    // 1. Sum of matchup votes must equal scenario total votes
    const sumMatchupVotes = sc.matchups.reduce((acc, m) => acc + m.total, 0);
    assert.equal(sumMatchupVotes, sc.totalVotes, `${code} sum of matchup votes must equal totalVotes (${sc.totalVotes})`);

    // 2. Sum of each model's wins across matchups must equal its byModel.wins
    const models = ['openai', 'gemini31flashlite', 'geminipro'];
    models.forEach((mId) => {
      let modelWinsInMatchups = 0;
      let modelAppearancesInMatchups = 0;

      sc.matchups.forEach((m) => {
        if (m.modelAId === mId) {
          modelWinsInMatchups += m.winsA;
          modelAppearancesInMatchups += m.total;
        } else if (m.modelBId === mId) {
          modelWinsInMatchups += m.winsB;
          modelAppearancesInMatchups += m.total;
        }
      });

      assert.equal(
        modelWinsInMatchups,
        sc.byModel[mId].wins,
        `${code} model ${mId} sum of matchup wins (${modelWinsInMatchups}) must equal byModel.wins (${sc.byModel[mId].wins})`
      );

      assert.equal(
        modelAppearancesInMatchups,
        sc.byModel[mId].appearances,
        `${code} model ${mId} sum of matchup appearances (${modelAppearancesInMatchups}) must equal byModel.appearances (${sc.byModel[mId].appearances})`
      );
    });
  });
});

test('pairwise analytics: all 10 scenarios appearances sum to 2 * totalVotes', () => {
  const scenarioStats = computeScenarioStats(rawVotes);
  assert.equal(scenarioStats.length, 10, 'Must have 10 scenarios');

  scenarioStats.forEach((sc) => {
    const totalAppsInScenario = Object.values(sc.byModel).reduce((sum, cell) => sum + cell.appearances, 0);
    assert.equal(totalAppsInScenario, sc.totalVotes * 2, `${sc.code} total appearances must equal 2 * totalVotes`);

    const decisiveWins = Object.values(sc.byModel).reduce((sum, cell) => sum + cell.wins, 0);
    const tiesInMatchups = sc.matchups.reduce((sum, m) => sum + m.ties, 0);
    assert.equal(decisiveWins + tiesInMatchups, sc.totalVotes, `${sc.code} decisive wins + ties must equal totalVotes`);
  });
});

test('pairwise analytics: head-to-head otherPairings reconciliation across all pairs', () => {
  const pairs = [
    ['openai', 'gemini31flashlite'],
    ['openai', 'geminipro'],
    ['gemini31flashlite', 'geminipro'],
  ];

  pairs.forEach(([pA, pB]) => {
    const h2h = computeHeadToHead(rawVotes, pA, pB);
    assert.equal(h2h.n, 40, `Pair ${pA} vs ${pB} must have exactly 40 direct votes`);
    assert.equal(h2h.otherPairings, 80, `Other pairings must equal 80 (120 - 40)`);
    assert.equal(h2h.winsA + h2h.winsB + h2h.ties, 40, `winsA + winsB + ties must equal 40`);
  });
});


