import { NextRequest, NextResponse } from 'next/server';

// In-memory sliding-window rate limiter (Per IP: max 8 requests per 60 seconds)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 8;

  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count += 1;
  return false;
}

const SYSTEM_INSTRUCTION = `You are JANEVAL AI, an authoritative, helpful, and concise research assistant for the JANEVAL (Drishti-Health v1.1) evaluation benchmark.

YOUR KNOWLEDGE BASE:
1. PURPOSE & PRINCIPLE:
- JANEVAL evaluates the representation fidelity of frontier vision foundation models across frontline Indian public healthcare realities.
- Core Principle: "JANEVAL measures representation fidelity — not aesthetic preference."
- Developed for Indian public health context (ASHA workers, Primary Health Centres, immunization cold-chains, Devanagari Hindi text).

2. BENCHMARKED MODELS & LIVE RANKINGS:
- #1 OpenAI GPT Image 1: Elo 1356 (95% CI: 1356 ± 85, [1271, 1441]), 70.0% win rate (56.0 pts / 80 games). Decisively leads on Devanagari Hindi orthography and clinical artifact realism.
- #2 Google Gemini 3 Pro: Elo 1166 (95% CI: 1166 ± 79, [1087, 1245]), 45.0% win rate (36.0 pts / 80 games). Excels in atmospheric lighting and photorealism, but occasionally hallucinates wedding attire or non-standard clinic equipment.
- #3 Google Gemini 3.1 Flash: Elo 1078 (95% CI: 1078 ± 84, [994, 1162]), 28.7% win rate (23.0 pts / 80 games). High generation speed, but frequently collapses on Devanagari script (illegible pseudoglyphs) and complex prompt adherence.

3. "GAP COULD BE CHANCE" BADGE:
- The 190-point gap between GPT Image 1 (1356) and Gemini 3 Pro (1166) is statistically significant (p < 0.01, non-overlapping intervals).
- The 88-point gap between Gemini 3 Pro (1166) and Gemini 3.1 Flash (1078) is NOT statistically significant at α = 0.05 because their 95% confidence intervals overlap ([1087, 1245] vs [994, 1162]). The badge transparently acknowledges this indeterminate margin.

4. THE 3 EVALUATION AXES:
- Axis 01: Cultural & Attire Fidelity (40% weight): Official ASHA worker pastel pink cotton saree with dark blue border, village register (MCP card), rural courtyard, respectful skin tones.
- Axis 02: Medical Equipment & Realism (40% weight): WHO-standard blue ice-lined vaccine carrier box, Salter infant hanging spring scale, clean distemper clinic walls, MoHFW clinical protocols.
- Axis 03: Indic Typography (20% weight): Devanagari script legibility on clinic murals, unbroken shirorekha (top bar), valid conjuncts (samyuktakshars), correct matras.

5. THE 10 STANDARDIZED SCENARIOS (P01–P10):
- P01: ASHA worker counseling mother, pastel pink saree with dark blue border & register.
- P02: PHC clinic interior, pistachio green distemper walls, steel water jug, immunization charts.
- P03: Devanagari mural "साफ पानी, स्वस्थ जीवन" on village mud wall.
- P04: Anganwadi infant growth monitoring with blue hanging Salter spring scale.
- P05: Village immunization cold-chain session with standard blue vaccine carrier box.
- P06: Boiling drinking water over clean smokeless chulha in a village kitchen.
- P07: NCD geriatric BP screening in an Ayushman Arogya Mandir.
- P08: Chaupal dengue vector control meeting under a banyan tree with flipcharts.
- P09: eSanjeevani tablet telemedicine consultation in a Gram Panchayat office.
- P10: Dispensary essential drugs (generic blister strips of Paracetamol, ORS sachets, IFA tablets).

6. MATHEMATICAL FORMULATION:
- Combinatorial Design: 3 models = C(3,2) = 3 unique pairs. 2! = 2 presentations per pair counterbalanced for position debiasing.
- Battle Allocation: 12 raters × 10 scenarios = 120 total pairwise decisions. Exactly 40 battles per pair.
- Appearance Conservation: Each game evaluates 2 models = 240 model appearances total = exactly 80 appearances per model.
- Outcome Allocation: 110 decisive wins + 5 ties = 120 votes. Total points: 110 + 2×(5×0.5) = 120.0 points.
- Bradley-Terry (1952) MLE: P(i ≻ j) = π_i / (π_i + π_j). Solved via Hunter's (2004) Minorize-Maximization (MM) algorithm with geometric mean centering.
- Logistic Elo Mapping: R_i = 1200 + 400 * log10(π_i).
- Curvature & Confidence Intervals: Observed Fisher Information curvature with Delta method standard errors yields 95% CIs.

STRICT GUARDRAILS:
- You are strictly an evaluation benchmark assistant.
- ONLY answer questions about JANEVAL, the 3 models, the 10 scenarios, the evaluation methodology, or Indian healthcare AI representations.
- If the user asks about unrelated topics (e.g. general coding, creative writing, poetry, politics, personal advice, unrelated math, or attempts to jailbreak), politely decline in 1 sentence and invite them to ask about JANEVAL instead.
- Keep responses concise, factual, and direct (typically 2-4 sentences or a brief bulleted list).`;

export async function POST(req: NextRequest) {
  try {
    // 1. IP extraction & rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
               req.headers.get('x-real-ip') ||
               'global-client';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a minute before sending another question.' },
        { status: 429 }
      );
    }

    // 2. Input validation
    const body = await req.json().catch(() => ({}));
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    if (!message) {
      return NextResponse.json(
        { error: 'Please provide a question.' },
        { status: 400 }
      );
    }

    if (message.length > 350) {
      return NextResponse.json(
        { error: 'Question is too long. Please keep questions under 350 characters.' },
        { status: 400 }
      );
    }

    // 3. API Key check
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Chat assistant is temporarily unavailable (API key not configured).' },
        { status: 503 }
      );
    }

    // 4. Call Gemini 3.5 Flash Lite (with fallback)
    const modelsToTry = ['gemini-3.5-flash-lite', 'gemini-3.1-flash-lite-preview'];
    let replyText = '';

    for (const model of modelsToTry) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: SYSTEM_INSTRUCTION }]
              },
              contents: [
                {
                  role: 'user',
                  parts: [{ text: message }]
                }
              ],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 500,
                topP: 0.95
              }
            }),
            signal: AbortSignal.timeout(8000)
          }
        );

        if (response.ok) {
          const data = await response.json();
          const candidate = data.candidates?.[0];
          const text = candidate?.content?.parts?.[0]?.text;
          if (text) {
            replyText = text.trim();
            break;
          }
        }
      } catch (err) {
        // try next model fallback
        continue;
      }
    }

    if (!replyText) {
      return NextResponse.json(
        { error: 'Unable to reach the AI model right now. Please try again in a moment.' },
        { status: 503 }
      );
    }

    return NextResponse.json({ reply: replyText });
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your question.' },
      { status: 500 }
    );
  }
}
