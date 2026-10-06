'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  Bot,
  User,
  AlertCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const STARTER_PROMPTS = [
  'Why is GPT Image 1 ranked #1?',
  'Explain the Bradley-Terry math',
  'Why does Gemini 3 Pro have "gap could be chance"?',
  'How did models handle Devanagari Hindi?',
  'What are the 3 evaluation axes?'
];

export function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello! I am **JANEVAL AI**, grounded in the Drishti-Health v1.1 evaluation data. Ask me anything about the model rankings, Bradley-Terry formulation, Devanagari fidelity, or public healthcare axes.',
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSend = async (messageToSend?: string) => {
    const text = (messageToSend ?? input).trim();
    if (!text || isLoading) return;

    if (text.length > 350) {
      setErrorMessage('Questions are capped at 350 characters to prevent abuse.');
      return;
    }

    setErrorMessage(null);
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get an answer.');
      }

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'assistant',
        text: 'Hello! I am **JANEVAL AI**, grounded in the Drishti-Health v1.1 evaluation data. Ask me anything about the model rankings, Bradley-Terry formulation, Devanagari fidelity, or public healthcare axes.',
        timestamp: 'Just now'
      }
    ]);
    setInput('');
    setErrorMessage(null);
  };

  const renderFormattedText = (text: string) => {
    // Render bold markdown and linebreaks cleanly
    const parts = text.split('\n');
    return parts.map((line, lineIdx) => {
      const formattedLine = line.split(/(\*\*.*?\*\*)/g).map((chunk, chunkIdx) => {
        if (chunk.startsWith('**') && chunk.endsWith('**')) {
          return (
            <strong key={chunkIdx} className="font-semibold text-[#0F2E24]">
              {chunk.slice(2, -2)}
            </strong>
          );
        }
        return chunk;
      });

      return (
        <span key={lineIdx} className={lineIdx > 0 ? 'block mt-1.5' : ''}>
          {formattedLine}
        </span>
      );
    });
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Launcher Pill Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 px-4 py-2.5 bg-[#0F2E24] hover:bg-[#163d30] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer border border-[#1b4335] active:scale-95"
          aria-label="Open JANEVAL AI Assistant"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-[#0F2E24]" />
          </div>
          <span className="text-xs font-semibold tracking-wide">Ask JANEVAL AI</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1f4a3b] text-emerald-200 border border-emerald-800/60 hidden sm:inline-block">
            Copilot
          </span>
        </button>
      )}

      {/* Slide-out Drawer / Chat Window */}
      {isOpen && (
        <div className="w-[calc(100vw-2.5rem)] sm:w-[410px] h-[540px] max-h-[85vh] bg-white rounded-2xl border border-[#E3E7E2] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="px-4 py-3 bg-[#0F2E24] text-white flex items-center justify-between border-b border-[#1b4335]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-emerald-300 border border-white/10">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-white tracking-wide">JANEVAL AI</h4>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Guarded
                  </span>
                </div>
                <p className="text-[10px] text-emerald-200/80">Public Health Evaluation Copilot</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Restart conversation"
                className="p-1.5 text-emerald-200/80 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                aria-label="Restart conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                className="p-1.5 text-emerald-200/80 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subheader: Guardrail Notice */}
          <div className="px-3.5 py-1.5 bg-[#FAFBF9] border-b border-[#E3E7E2] flex items-center justify-between text-[10px] text-[#69716B]">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#4E8F6F]" />
              <span>Domain-locked: Drishti v1.1 &amp; Bradley-Terry math</span>
            </div>
            <span className="font-mono text-[9px] text-[#8C948E]">Rate-limited</span>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#F7F8F5]/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2 text-xs ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-md bg-[#0F2E24] text-emerald-200 flex-shrink-0 flex items-center justify-center mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 leading-relaxed shadow-2xs ${
                    m.sender === 'user'
                      ? 'bg-[#0F2E24] text-white rounded-br-xs'
                      : 'bg-white border border-[#E3E7E2] text-[#171A18] rounded-bl-xs'
                  }`}
                >
                  <div className="text-[11px] break-words">
                    {renderFormattedText(m.text)}
                  </div>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      m.sender === 'user' ? 'text-emerald-200/60' : 'text-[#8C948E]'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>

                {m.sender === 'user' && (
                  <div className="w-6 h-6 rounded-md bg-[#E3E7E2] text-[#0F2E24] flex-shrink-0 flex items-center justify-center mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2 text-xs items-center">
                <div className="w-6 h-6 rounded-md bg-[#0F2E24] text-emerald-200 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-white border border-[#E3E7E2] rounded-xl px-3 py-2 text-[11px] text-[#69716B] flex items-center gap-2 shadow-2xs">
                  <span className="inline-block w-1.5 h-1.5 bg-[#4E8F6F] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="inline-block w-1.5 h-1.5 bg-[#4E8F6F] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="inline-block w-1.5 h-1.5 bg-[#4E8F6F] rounded-full animate-bounce" />
                  <span className="text-[10px] ml-1">Analyzing benchmark data...</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                <span className="leading-tight">{errorMessage}</span>
              </div>
            )}

            {/* Suggested Starter Chips */}
            {messages.length <= 2 && !isLoading && (
              <div className="pt-2">
                <p className="text-[10px] font-semibold text-[#69716B] uppercase tracking-wider mb-2">
                  Suggested Questions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {STARTER_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(prompt)}
                      className="text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#DDEBE3]/50 text-[#0F2E24] border border-[#E3E7E2] hover:border-[#4E8F6F] transition-all duration-150 cursor-pointer shadow-2xs"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-2.5 bg-white border-t border-[#E3E7E2]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-1.5"
            >
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about models, ratings, or math..."
                  maxLength={350}
                  disabled={isLoading}
                  className="w-full text-xs px-3 py-2 pr-12 rounded-lg bg-[#FAFBF9] border border-[#E3E7E2] focus:outline-none focus:border-[#0F2E24] focus:ring-1 focus:ring-[#0F2E24] placeholder:text-[#8C948E] disabled:opacity-50"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-[#8C948E]">
                  {350 - input.length}
                </span>
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 rounded-lg bg-[#0F2E24] hover:bg-[#163d30] disabled:bg-[#E3E7E2] text-white disabled:text-[#8C948E] flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed shadow-2xs flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
            <div className="mt-1 flex items-center justify-between text-[9px] text-[#8C948E] px-1">
              <span>Powered by Gemini 3.5 Flash-Lite</span>
              <span>Max 350 chars • 8 req/min</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
