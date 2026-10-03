'use client';

import React, { useState } from 'react';
import { PROMPTS_DATA, MODELS_INFO } from '@/data/prompts';
import staticManifest from '@/data/database_manifest.json';
import { ZoomIn, Info, ExternalLink } from 'lucide-react';

export function GalleryView() {
  const [selectedPromptId, setSelectedPromptId] = useState<string>('all');
  const [zoomImage, setZoomImage] = useState<{ url: string; title: string; model: string } | null>(null);

  const filteredPrompts = selectedPromptId === 'all'
    ? PROMPTS_DATA
    : PROMPTS_DATA.filter((p) => p.id === selectedPromptId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">30-Image Evaluation Gallery</h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete comparative matrix: 10 prompts evaluated across 3 foundation vision models.
          </p>
        </div>

        {/* Prompt Filter Dropdown */}
        <div className="flex items-center space-x-2">
          <label className="text-xs text-slate-400 font-medium">Filter:</label>
          <select
            value={selectedPromptId}
            onChange={(e) => setSelectedPromptId(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All 10 Scenarios (30 Images)</option>
            {PROMPTS_DATA.map((p) => (
              <option key={p.id} value={p.id}>{p.id}: {p.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Prompts Matrix */}
      <div className="space-y-12">
        {filteredPrompts.map((p) => {
          const promptImages = staticManifest.filter((m: any) => m.prompt_id === p.id);

          return (
            <div key={p.id} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 shadow-xl">
              {/* Scenario Header */}
              <div className="mb-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {p.id}
                  </span>
                  <h2 className="text-base font-bold text-white">{p.title}</h2>
                  <span className="text-xs text-slate-400">({p.category})</span>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 font-mono mb-2">
                  &ldquo;{p.prompt}&rdquo;
                </p>

                <p className="text-[11px] text-slate-400 flex items-center space-x-1">
                  <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span><strong>Why it matters for India:</strong> {p.whyItMatters}</span>
                </p>
              </div>

              {/* 3-Model Side-by-Side Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {promptImages.map((img: any, idx: number) => {
                  return (
                    <div
                      key={idx}
                      className="group bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700 transition-all"
                    >
                      <div className="px-3.5 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                        <span className="font-semibold text-white truncate max-w-[190px]">{img.model_name}</span>
                        <a
                          href={img.image_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-500 hover:text-emerald-400 p-1"
                          title="Open full resolution in Supabase CDN"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <div
                        className="relative aspect-square w-full overflow-hidden bg-slate-900 cursor-pointer"
                        onClick={() => setZoomImage({ url: img.image_url, title: p.title, model: img.model_name })}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.image_url}
                          alt={`${p.title} - ${img.model_name}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          loading="lazy"
                        />
                        <button
                          type="button"
                          className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-950/80 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Zoom Modal */}
      {zoomImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md" onClick={() => setZoomImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh] bg-slate-900 p-2 rounded-2xl border border-slate-800 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-2 text-xs text-slate-300 font-semibold border-b border-slate-800 mb-2">
              <span>{zoomImage.title} — {zoomImage.model}</span>
              <button onClick={() => setZoomImage(null)} className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800">Close ✕</button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={zoomImage.url} alt={zoomImage.title} className="max-w-full max-h-[75vh] object-contain rounded-xl mx-auto" />
          </div>
        </div>
      )}
    </div>
  );
}
