import { test } from 'node:test';
import assert from 'node:assert/strict';
import { trackEvent, getAnalyticsEventLog, clearAnalyticsEventLog } from '../src/lib/analytics.ts';

test('analytics: tracks event without PII or model names', () => {
  clearAnalyticsEventLog();

  trackEvent('hero_image_clicked', { position: 'left' });
  trackEvent('consent_completed', { age_verified: true });
  trackEvent('arena_started', { session_id: 'test-session-123' });

  const log = getAnalyticsEventLog();
  assert.equal(log.length, 3);
  assert.equal(log[0].event, 'hero_image_clicked');
  assert.equal(log[0].properties.position, 'left');
  assert.equal(log[1].event, 'consent_completed');
  assert.equal(log[1].properties.age_verified, true);
});

test('analytics guard: strips forbidden model names and email PII', () => {
  clearAnalyticsEventLog();

  trackEvent('comparison_evaluated', {
    prompt_id: 'P01',
    prompt_index: 0,
    outcome: 'A',
    forbidden_model: 'OpenAI GPT Image 1',
    evaluator_email: 'priya@example.com',
  });

  const log = getAnalyticsEventLog();
  assert.equal(log.length, 1);
  const props = log[0].properties;

  assert.equal(props.prompt_id, 'P01');
  assert.equal(props.outcome, 'A');
  // Both sensitive fields must be scrubbed
  assert.equal(props.forbidden_model, undefined);
  assert.equal(props.evaluator_email, undefined);
});

test('analytics: tracks rankings redesign events cleanly', () => {
  clearAnalyticsEventLog();

  trackEvent('model_row_select', { rank: 1, slot: 'A' });
  trackEvent('compare_pair_change', { rank_a: 1, rank_b: 2 });
  trackEvent('heatmap_cell_open', { scenario_code: 'S01', model_rank: 1 });
  trackEvent('rail_link_click', { section_id: 'scenarios' });
  trackEvent('rubric_section_toggle', { is_open: true });

  const log = getAnalyticsEventLog();
  assert.equal(log.length, 5);
  assert.equal(log[0].event, 'model_row_select');
  assert.equal(log[0].properties.rank, 1);
  assert.equal(log[0].properties.slot, 'A');
  assert.equal(log[1].event, 'compare_pair_change');
  assert.equal(log[1].properties.rank_a, 1);
  assert.equal(log[1].properties.rank_b, 2);
  assert.equal(log[2].event, 'heatmap_cell_open');
  assert.equal(log[2].properties.scenario_code, 'S01');
  assert.equal(log[3].event, 'rail_link_click');
  assert.equal(log[3].properties.section_id, 'scenarios');
  assert.equal(log[4].event, 'rubric_section_toggle');
  assert.equal(log[4].properties.is_open, true);
});

test('analytics: tracks matchup_focus and how_add_up_open events cleanly', () => {
  clearAnalyticsEventLog();

  trackEvent('matchup_focus', { scenario_code: 'S01', pair_index: 0, rank_a: 1, rank_b: 2 });
  trackEvent('how_add_up_open', { scenario_code: 'S01' });

  const log = getAnalyticsEventLog();
  assert.equal(log.length, 2);
  assert.equal(log[0].event, 'matchup_focus');
  assert.equal(log[0].properties.scenario_code, 'S01');
  assert.equal(log[0].properties.pair_index, 0);
  assert.equal(log[1].event, 'how_add_up_open');
  assert.equal(log[1].properties.scenario_code, 'S01');
});


