import { NextResponse } from 'next/server';
import { PROMPTS_DATA } from '@/data/prompts';
import staticManifest from '@/data/database_manifest.json';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get('format') || 'json';

  // Build full enriched dataset linking prompts + generated images + criteria
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
        'Content-Disposition': 'attachment; filename="drishti_health_eval_dataset.csv"',
      },
    });
  }

  return NextResponse.json({
    project: 'Drishti-Health Evaluation Benchmark',
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
