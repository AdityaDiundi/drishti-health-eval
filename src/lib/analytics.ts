/**
 * JANEVAL Analytics Client
 *
 * Privacy-first, additive telemetry client.
 * Rules:
 * - No model identity, personal data (PII), or free text in any event payload.
 * - In dev/test/preview environments, network dispatch is disabled and logged
 *   to an in-memory audit log for automated verification.
 */

export type AnalyticsEventName =
  | 'page_view'
  | 'hero_image_clicked'
  | 'consent_started'
  | 'consent_completed'
  | 'arena_started'
  | 'comparison_evaluated'
  | 'session_completed'
  | 'dataset_downloaded'
  | 'model_expanded'
  | 'model_row_select'
  | 'compare_pair_change'
  | 'heatmap_cell_open'
  | 'rail_link_click'
  | 'rubric_section_toggle'
  | 'matchup_focus'
  | 'how_add_up_open';

export interface AnalyticsEventRecord {
  event: AnalyticsEventName;
  properties: Record<string, unknown>;
  timestamp: string;
}

// In-memory buffer for verification and local audit
const eventLog: AnalyticsEventRecord[] = [];

// Blacklist to prevent accidental leakage of PII or model identity
const FORBIDDEN_WORDS = [
  'openai',
  'gpt',
  'gemini',
  'dall',
  'google',
  '@',
  'email',
  'priya',
  'aditya',
];

function sanitizePayload(properties: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(properties)) {
    if (typeof value === 'string') {
      const lower = value.toLowerCase();
      const containsForbidden = FORBIDDEN_WORDS.some((word) => lower.includes(word));
      if (containsForbidden) {
        console.warn(`[Analytics Guard] Stripped sensitive or identifying field: "${key}"`);
        continue;
      }
      sanitized[key] = value;
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export function trackEvent(event: AnalyticsEventName, properties: Record<string, unknown> = {}) {
  const sanitizedProps = sanitizePayload(properties);
  const record: AnalyticsEventRecord = {
    event,
    properties: sanitizedProps,
    timestamp: new Date().toISOString(),
  };

  eventLog.push(record);

  // In development, preview, or test environments: disable external network dispatch
  const isDevOrTest =
    process.env.NODE_ENV !== 'production' ||
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== 'true';

  if (isDevOrTest) {
    if (typeof window !== 'undefined' && (window as unknown as { __DEBUG_ANALYTICS__?: boolean }).__DEBUG_ANALYTICS__) {
      console.log(`[Analytics Event] ${event}`, sanitizedProps);
    }
    return;
  }

  // If a production telemetry provider is configured in future, dispatch here safely.
}

export function getAnalyticsEventLog(): AnalyticsEventRecord[] {
  return [...eventLog];
}

export function clearAnalyticsEventLog(): void {
  eventLog.length = 0;
}
