'use client';

import React, { useState } from 'react';
import { PROMPTS_DATA } from '@/data/prompts';
import staticManifest from '@/data/database_manifest.json';
import { ZoomIn, Info, ExternalLink } from 'lucide-react';

export function GalleryView() {
  const [selectedPromptId, setSelectedPromptId] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [zoomImage, setZoomImage] = useState<{ url: string; title: string; model: string } | null>(null);

  const filteredPrompts = selectedPromptId === 'all'
    ? PROMPTS_DATA
    : PROMPTS_DATA.filter((p) => p.id === selectedPromptId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">30-Image Evaluation Matrix</h1>
          <p className="text-xs text-gray-500 mt-1">
            Complete comparative matrix: 10 public health scenarios across 3 foundation vision models.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <label className="text-xs text-gray-500 font-medium">Scenario:</label>
            <select
              value={selectedPromptId}
              onChange={(e) => setSelectedPromptId(e.target.value)}
              className="bg-white border border-gray-300 text-xs text-gray-800 rounded-xl px-3 py-1.5 focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-100 shadow-2xs"
            >
              <option value="all">All 10 Scenarios (30 Images)</option>
              {PROMPTS_DATA.map((p) => (
                <option key={p.id} value={p.id}>{p.id}: {p.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Prompts Matrix */}
      <div className="space-y-10">
        {filteredPrompts.map((p) => {
          const promptImages = staticManifest.filter((m: any) => m.prompt_id === p.id);

          return (
            <div key={p.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
              {/* Scenario Header */}
              <div className="mb-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {p.id}
                  </span>
                  <h2 className="text-base font-bold text-gray-900">{p.title}</h2>
                  <span className="text-xs text-gray-500">({p.category})</span>
                </div>

                <p className="text-xs text-gray-800 bg-gray-50 p-3 rounded-xl border border-gray-200 font-mono mb-2 leading-relaxed">
                  &ldquo;{p.prompt}&rdquo;
                </p>

                <p className="text-[11px] text-gray-600 flex items-center space-x-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span><strong>Why it matters for India:</strong> {p.whyItMatters}</span>
                </p>
              </div>

              {/* 3-Model Side-by-Side Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {promptImages.map((img: any, idx: number) => {
                  return (
                    <div
                      key={idx}
                      className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-2xs hover:border-gray-300 hover:shadow-xs transition-all"
                    >
                      <div className="px-3.5 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs">
                        <span className="font-semibold text-gray-900 truncate max-w-[190px]">{img.model_name}</span>
                        <a
                          href={img.image_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-400 hover:text-blue-600 p-1"
                          title="Open full resolution in Supabase CDN"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <div
                        className="relative aspect-square w-full overflow-hidden bg-gray-100 cursor-pointer"
                        onClick={() => setZoomImage({ url: img.image_url, title: p.title, model: img.model_name })}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.image_url}
                          alt={`${p.title} - ${img.model_name}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                          loading="lazy"
                        />
                        <button
                          type="button"
                          className="absolute bottom-2.5 right-2.5 bg-white/90 text-gray-800 p-1.5 rounded-lg text-xs shadow-sm opacity-90 group-hover:opacity-100 transition-opacity flex items-center space-x-1"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-semibold">Zoom</span>
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

      {/* Lightbox Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-xs"
          onClick={() => setZoomImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white p-3 rounded-2xl border border-gray-200 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-3 py-2 text-xs text-gray-800 font-semibold border-b border-gray-200 mb-2">
              <div>
                <span className="text-gray-900 font-bold">{zoomImage.title}</span>
                <span className="text-gray-500 ml-2">({zoomImage.model})</span>
              </div>
              <button
                onClick={() => setZoomImage(null)}
                className="text-gray-500 hover:text-gray-900 px-2 py-0.5 rounded bg-gray-100"
              >
                Close ✕
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={zoomImage.url}
              alt={zoomImage.title}
              className="max-w-full max-h-[75vh] object-contain rounded-xl mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
