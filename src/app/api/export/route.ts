import { NextResponse } from 'next/server';
import { PROMPTS_DATA } from '@/data/prompts';
import staticManifest from '@/data/database_manifest.json';
import { getAdminSupabase, supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') || 'json';
  const type = searchParams.get('type') || 'benchmark'; // 'benchmark' or 'ratings'

  // If user requests anonymized evaluations export
  if (type === 'ratings' || type === 'evaluations') {
    const admin = getAdminSupabase();
    let ratingsData: any[] = [];
    try {
      const res = await admin.from('eval_ratings').select('id, participant_id, prompt_id, winner_model, cultural_fidelity, medical_accuracy, typography_fidelity, feedback, created_at');
      if (res.data) ratingsData = res.data;
    } catch (e) {
      const fb = await supabase.from('eval_ratings').select('id, participant_id, prompt_id, winner_model, cultural_fidelity, medical_accuracy, typography_fidelity, feedback, created_at');
      if (fb.data) ratingsData = fb.data;
    }

    // Strict PII Anonymization: Hash participant IDs into "Evaluator #01", "Evaluator #02"
    const participantMap = new Map<string, string>();
    let counter = 1;

    const anonymizedRatings = ratingsData.map((r) => {
      if (!participantMap.has(r.participant_id)) {
        participantMap.set(r.participant_id, `Evaluator #${String(counter++).padStart(2, '0')}`);
      }
      return {
        evaluator_alias: participantMap.get(r.participant_id),
        prompt_id: r.prompt_id,
        winner_model: r.winner_model,
        cultural_fidelity: r.cultural_fidelity,
        medical_accuracy: r.medical_accuracy,
        typography_fidelity: r.typography_fidelity,
        feedback: r.feedback || '',
        created_at: r.created_at,
      };
    });

    if (format === 'csv') {
      const headers = ['evaluator_alias', 'prompt_id', 'winner_model', 'cultural_fidelity', 'medical_accuracy', 'typography_fidelity', 'feedback', 'created_at'];
      const csvRows = [headers.join(',')];
      anonymizedRatings.forEach((row: any) => {
        const escaped = headers.map((h) => `"${String(row[h] || '').replace(/"/g, '""')}"`);
        csvRows.push(escaped.join(','));
      });

      return new NextResponse(csvRows.join('\n'), {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="janeval_ratings_anonymized.csv"',
        },
      });
    }

    return NextResponse.json({
      project: 'JANEVAL Human Evaluation Ratings (Anonymized)',
      total_votes: anonymizedRatings.length,
      pii_policy: 'Strictly Anonymized — Zero Emails or Personal Identifiable Information Expose',
      ratings: anonymizedRatings,
    });
  }

  // Default: Public Benchmark Prompts & Models (Zero user data)
  const exportData = staticManifest.map((item: any) => {
    const promptMeta = PROMPTS_DATA.find((p) => p.id === item.prompt_id);
    return {
      prompt_id: item.id || item.prompt_id,
      category: promptMeta?.category || 'Public Health',
      title: promptMeta?.title || item.prompt_id,
      prompt_text: item.prompt_text,
      model_name: item.model_name,
      image_cdn_url: item.image_url,
      rubric_focus: promptMeta?.rubricFocus || '',
      why_it_matters_india: promptMeta?.whyItMatters || '',
      checkpoints: promptMeta?.keyVisualCheckpoints?.join(' | ') || '',
    };
  });

  if (format === 'csv') {
    const headers = ['prompt_id', 'category', 'title', 'model_name', 'image_cdn_url', 'prompt_text', 'rubric_focus', 'why_it_matters_india'];
    const csvRows = [headers.join(',')];

    exportData.forEach((row: any) => {
      const escaped = headers.map((h) => {
        const val = String(row[h] || '').replace(/"/g, '""');
        return `"${val}"`;
      });
      csvRows.push(escaped.join(','));
    });

    return new NextResponse(csvRows.join('\n'), {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="janeval_benchmark_dataset.csv"',
      },
    });
  }

  return NextResponse.json({
    project: 'JANEVAL Benchmark v1.0',
    evaluator: 'Josh Talks AI Product Challenge',
    dataset_version: '1.0.0',
    total_images: exportData.length,
    models_evaluated: [
      'Google Gemini 3.1 Flash Image Preview (Nano Banana 2)',
      'Google Gemini 3 Pro Image Preview (Nano Banana Pro)',
      'OpenAI GPT Image 1',
    ],
    items: exportData,
  });
}

