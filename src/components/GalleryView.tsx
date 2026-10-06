'use client';

import React, { useState } from 'react';
import { PROMPTS_DATA } from '@/data/prompts';
import staticManifest from '@/data/database_manifest.json';
import { ZoomIn, ExternalLink, X, Info } from 'lucide-react';

export function GalleryView() {
  const [selectedPromptId, setSelectedPromptId] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [zoomImage, setZoomImage] = useState<{
    url: string;
    title: string;
    model: string;
    prompt: string;
    axis: string;
  } | null>(null);

  const filteredPrompts =
    selectedPromptId === 'all'
      ? PROMPTS_DATA
      : PROMPTS_DATA.filter((p) => p.id === selectedPromptId);

  const getAxisForPrompt = (promptId: string) => {
    const num = parseInt(promptId.replace('P', ''), 10);
    if (num <= 3) return 'Cultural Fidelity';
    if (num <= 6) return 'Infrastructural Fidelity';
    return 'Orthographic Fidelity';
  };

  return (
    <div id="gallery-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 scroll-mt-20">
      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#E3E7E2]">
        <div>
          <div className="text-[10px] font-mono uppercase font-bold text-[#69716B] tracking-wider mb-1">
            BENCHMARK IMAGE MATRIX
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F2E24] tracking-tight">
            Generated Scenario Gallery
          </h1>
          <p className="text-xs text-[#69716B] mt-1 max-w-2xl">
            Complete comparative matrix: 10 rural public-health scenarios across 3 frontier vision foundation models (30 images).
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <label className="text-xs text-[#69716B] font-medium">Scenario:</label>
            <select
              value={selectedPromptId}
              onChange={(e) => setSelectedPromptId(e.target.value)}
              className="bg-white border border-[#E3E7E2] text-xs text-[#171A18] rounded-lg px-3 py-1.5 focus:outline-hidden focus:border-[#0F2E24] shadow-2xs font-medium cursor-pointer"
            >
              <option value="all">All 10 Scenarios (30 Images)</option>
              {PROMPTS_DATA.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.id}: {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reviewer Audit Notice Banner */}
      <div className="bg-[#FAFBF9] border border-[#E3E7E2] rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-[#69716B] shadow-2xs">
        <Info className="w-4 h-4 text-[#0F2E24] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-[#0F2E24]">Methodology &amp; Evaluation Integrity Notice:</span>
          <p className="leading-relaxed">
            In live research benchmarking, this entire image matrix is air-gapped from human raters to eliminate cognitive anchoring, style-fingerprinting, and evaluator contamination in the Arena. It is made transparently accessible here specifically for assignment review, prompt adherence auditing, and model output inspection.
          </p>
        </div>
      </div>

      {/* Prompts Matrix */}
      <div className="space-y-10">
        {filteredPrompts.map((p) => {
          const promptImages = staticManifest.filter((m: any) => m.prompt_id === p.id);
          const axisName = getAxisForPrompt(p.id);

          return (
            <div
              key={p.id}
              id={`gallery-${p.id}`}
              className="bg-white border border-[#E3E7E2] rounded-xl p-5 sm:p-6 shadow-2xs space-y-4 scroll-mt-24 transition-all duration-300"
            >
              {/* Scenario Context Header */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-[#0F2E24] text-white">
                    {p.id}
                  </span>
                  <span className="font-bold text-sm sm:text-base text-[#171A18]">
                    {p.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAFBF9] border border-[#E3E7E2] text-[#69716B]">
                    {axisName}
                  </span>
                </div>

                <div className="text-xs font-mono text-[#171A18] bg-[#FAFBF9] border border-[#E3E7E2] p-3 rounded-lg leading-relaxed">
                  &ldquo;{p.prompt}&rdquo;
                </div>

                <div className="text-[11px] text-[#69716B] flex items-start space-x-1.5 pt-0.5">
                  <span className="font-semibold text-[#0F2E24] shrink-0">Field Evaluation Signal:</span>
                  <span>{p.whyItMatters}</span>
                </div>
              </div>

              {/* 3 Model Image Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                {promptImages.map((img: any, idx: number) => {
                  return (
                    <div
                      key={idx}
                      className="group bg-white border border-[#E3E7E2] rounded-lg overflow-hidden shadow-2xs hover:border-[#0F2E24]/30 transition-all flex flex-col justify-between"
                    >
                      {/* Image Preview Container */}
                      <div
                        className="relative aspect-square w-full overflow-hidden bg-[#FAFBF9] cursor-pointer"
                        onClick={() =>
                          setZoomImage({
                            url: img.image_url,
                            title: p.title,
                            model: img.model_name,
                            prompt: p.prompt,
                            axis: axisName,
                          })
                        }
                      >
                        <img
                          src={img.image_url}
                          alt={`${p.title} - ${img.model_name}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                          loading="lazy"
                        />
                        <button
                          type="button"
                          className="absolute bottom-2.5 right-2.5 bg-white/90 text-[#171A18] px-2 py-1 rounded-md text-[10px] font-semibold shadow-xs opacity-90 group-hover:opacity-100 transition-opacity flex items-center space-x-1 cursor-pointer"
                        >
                          <ZoomIn className="w-3 h-3" />
                          <span>Inspect</span>
                        </button>
                      </div>

                      {/* Card Footer */}
                      <div className="px-3 py-2 bg-white border-t border-[#E3E7E2] flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#0F2E24] truncate text-[11px]">
                          {img.model_name}
                        </span>
                        <a
                          href={img.image_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#69716B] hover:text-[#0F2E24] p-1"
                          title="Open full resolution"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Focused Lightbox Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setZoomImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[92vh] bg-white rounded-xl border border-[#E3E7E2] shadow-2xl p-4 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E3E7E2] mb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold text-[#0F2E24]">{zoomImage.title}</span>
                  <span className="text-xs font-mono text-[#69716B]">· {zoomImage.model}</span>
                </div>
                <span className="text-[10px] font-mono text-[#4E8F6F] uppercase font-semibold">
                  {zoomImage.axis}
                </span>
              </div>
              <button
                onClick={() => setZoomImage(null)}
                className="text-[#69716B] hover:text-[#171A18] p-1.5 rounded-lg hover:bg-[#F7F8F5] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="flex-1 overflow-auto flex items-center justify-center bg-[#FAFBF9] rounded-lg border border-[#E3E7E2] p-2">
              <img
                src={zoomImage.url}
                alt={zoomImage.title}
                className="max-h-[65vh] w-auto object-contain rounded"
              />
            </div>

            {/* Prompt Strip */}
            <div className="mt-3 p-2.5 rounded-lg bg-[#F7F8F5] border border-[#E3E7E2] text-xs font-mono text-[#171A18]">
              <span className="text-[#69716B] font-bold uppercase text-[10px] block mb-0.5">
                Target Prompt:
              </span>
              &ldquo;{zoomImage.prompt}&rdquo;
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
