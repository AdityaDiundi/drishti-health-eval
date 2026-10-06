'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles,
  X,
  Send,
  RotateCcw,
  Info,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Flag,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

export interface ChatAssistantProps {
  activeTab: 'arena' | 'leaderboard' | 'evidence' | 'gallery' | 'methodology';
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  presetPrompt?: string | null;
  onClearPresetPrompt?: () => void;
  onNavigateTab?: (tab: 'arena' | 'leaderboard' | 'evidence' | 'gallery' | 'methodology') => void;
}

interface MessageItem {
  id: string;
  sender: 'user' | 'assistant';
  plainAnswer: string;
  details?: string;
  targetAnchor?: string | null;
  targetLabel?: string | null;
  followUps?: string[];
  timestamp?: string;
  feedbackGiven?: 'up' | 'down' | 'report' | null;
}

// Plain questions first, followed by technical & navigation chips
const SECTION_CHIPS: Record<string, string[]> = {
  leaderboard: [
    'What is this benchmark?',
    'Show me the Gallery',
    'Compare models',
    'Explain the Bradley-Terry math',
    'Why is GPT Image 1 ranked #1?',
    'What does the ± mean?',
    'Download dataset',
  ],
  evidence: [
    'Show me the Gallery',
    'Take me to Rankings',
    'Which scenario had the highest win rate?',
    'Why did models struggle on P03?',
    'Explain the 3 evaluation axes',
    'Explain the Bradley-Terry math',
  ],
  gallery: [
    'Take me to Rankings',
    'Show me Evidence',
    'How were the 10 scenarios designed?',
    'Can I see all models side by side?',
    'Explain the Bradley-Terry math',
  ],
  methodology: [
    'Explain the Bradley-Terry math',
    'Show me the Gallery',
    'Take me to Rankings',
    'What is Hunter\'s MM algorithm?',
    'How were the 12 raters calibrated?',
    'Can I trust 120 votes?',
  ],
};

function detectNavigationTarget(text: string): { anchor: string; isExplicit: boolean } | null {
  const t = text.trim().toLowerCase();
  const hasNavPrefix = /^(show(\s+me)?|take\s+me\s+to|go\s+to|open|view|navigate\s+to|switch\s+to|bring\s+me\s+to|jump\s+to|see)\b/i.test(t);

  if (t.includes('gallery')) {
    return { anchor: 'gallery', isExplicit: hasNavPrefix || t === 'gallery' };
  }
  if (t.includes('rankings') || t.includes('leaderboard') || t.includes('standings') || t.includes('ranking')) {
    return { anchor: 'leaderboard', isExplicit: hasNavPrefix || t === 'rankings' || t === 'leaderboard' };
  }
  if (t.includes('evidence') || t.includes('pairwise battle')) {
    return { anchor: 'evidence', isExplicit: hasNavPrefix || t === 'evidence' };
  }
  if (t.includes('methodology') || t.includes('protocol') || t.includes('specification')) {
    return { anchor: 'methodology', isExplicit: hasNavPrefix || t === 'methodology' };
  }
  if (t.includes('compare') || t.includes('comparison') || t.includes('head to head')) {
    return { anchor: 'compare-section', isExplicit: hasNavPrefix || t.startsWith('compare') };
  }
  if (t.includes('bradley') || t.includes('hunter') || (t.includes('math') && !t.includes('why'))) {
    return { anchor: 'bradley-terry-math', isExplicit: hasNavPrefix };
  }
  if (t.includes('download') && (t.includes('dataset') || t.includes('csv') || t.includes('data'))) {
    return { anchor: 'download-dataset', isExplicit: hasNavPrefix };
  }
  if (t.includes('arena') || t.includes('blind test') || t.includes('evaluate')) {
    return { anchor: 'arena', isExplicit: hasNavPrefix };
  }

  const matchP = t.match(/p[0-1][0-9]/i);
  if (matchP) {
    return { anchor: `scenario-${matchP[0].toUpperCase()}`, isExplicit: hasNavPrefix };
  }

  return null;
}

function getTargetLabel(anchor: string): string {
  const l = anchor.toLowerCase();
  if (l === 'gallery' || l.includes('gallery')) return 'Go to Gallery';
  if (l === 'evidence' || l.includes('evidence')) return 'Go to Evidence';
  if (l === 'methodology' || l.includes('methodology')) return 'Go to Methodology';
  if (l === 'leaderboard' || l.includes('rankings') || l.includes('table')) return 'Go to Rankings';
  if (l === 'arena') return 'Go to Arena';
  if (l === 'compare-section' || l.includes('compare')) return 'Show Comparison Tool';
  if (l.includes('bradley') || l.includes('math')) return 'Show Bradley-Terry math';
  if (l.includes('openai')) return 'Show OpenAI row';
  if (l.includes('flash')) return 'Show Gemini Flash row';
  if (l.includes('pro')) return 'Show Gemini Pro row';
  if (l.includes('download')) return 'Download Dataset';
  const match = anchor.match(/p[0-1][0-9]/i);
  if (match) return `Show Scenario ${match[0].toUpperCase()}`;
  return 'Show on page';
}

const INITIAL_GREETING: MessageItem = {
  id: 'greeting',
  sender: 'assistant',
  plainAnswer:
    'I can answer questions about this benchmark\'s results and method. I may make mistakes, so check key numbers in the table.',
  // No timestamp on greeting per requirement
};

export function ChatAssistant({
  activeTab,
  isOpen,
  onOpenChange,
  presetPrompt,
  onClearPresetPrompt,
  onNavigateTab,
}: ChatAssistantProps) {
  const [messages, setMessages] = useState<MessageItem[]>([INITIAL_GREETING]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [rateLimitCountdown, setRateLimitCountdown] = useState<number | null>(null);
  const [lastUserPrompt, setLastUserPrompt] = useState<string | null>(null);
  const [infoTooltipOpen, setInfoTooltipOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll to bottom of conversation
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      // Accessibility: focus input on open
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      trackEvent('assistant_open', { section: activeTab });
    } else {
      // Accessibility: restore focus to launcher on close
      launcherRef.current?.focus();
    }
  }, [isOpen, activeTab, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Rate limit countdown tick
  useEffect(() => {
    if (rateLimitCountdown !== null && rateLimitCountdown > 0) {
      countdownTimerRef.current = setTimeout(() => {
        setRateLimitCountdown((prev) => (prev && prev > 1 ? prev - 1 : null));
      }, 1000);
    }
    return () => {
      if (countdownTimerRef.current) clearTimeout(countdownTimerRef.current);
    };
  }, [rateLimitCountdown]);

  // Handle preset prompt injected from "Ask about this" button on ranking rows or scenarios
  useEffect(() => {
    if (presetPrompt) {
      if (!isOpen) {
        onOpenChange(true);
      }
      handleSend(presetPrompt);
      onClearPresetPrompt?.();
    }
  }, [presetPrompt]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard accessibility: Escape key closes assistant
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onOpenChange]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend ?? input).trim();
    if (!text || isLoading || rateLimitCountdown !== null) return;

    if (text.length > 350) {
      setErrorMessage('Question exceeds the 350-character limit.');
      return;
    }

    setErrorMessage(null);
    setLastUserPrompt(text);

    const userMessage: MessageItem = {
      id: `u-${Date.now()}`,
      sender: 'user',
      plainAnswer: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429 && data.retryAfter) {
          setRateLimitCountdown(Number(data.retryAfter));
        }
        trackEvent('assistant_error', {
          errorType: res.status === 429 ? 'rate_limit' : 'api_error',
          status: res.status,
        });
        throw new Error(data.error || 'Failed to get an answer.');
      }

      let anchorToNavigate = data.targetAnchor;
      let labelToUse = data.targetLabel;
      const detected = detectNavigationTarget(text);

      if (!anchorToNavigate && detected) {
        anchorToNavigate = detected.anchor;
      }
      if (anchorToNavigate && !labelToUse) {
        labelToUse = getTargetLabel(anchorToNavigate);
      }

      const assistantMsg: MessageItem = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        plainAnswer: data.plainAnswer || data.reply || '',
        details: data.details || undefined,
        targetAnchor: anchorToNavigate || null,
        targetLabel: labelToUse || null,
        followUps: Array.isArray(data.followUps) ? data.followUps : [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If user had an explicit navigation intent ("show me...", "go to...", "take me to...", etc.), auto-navigate immediately
      if (anchorToNavigate && (detected?.isExplicit || /^(show(\s+me)?|take\s+me\s+to|go\s+to|open|view|navigate\s+to|switch\s+to|see)\b/i.test(text))) {
        setTimeout(() => {
          handleScrollToAnchor(anchorToNavigate);
        }, 120);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastUserPrompt) {
      handleSend(lastUserPrompt);
    }
  };

  const handleChipClick = (chipText: string) => {
    trackEvent('assistant_chip_click', { chip: chipText, section: activeTab });
    handleSend(chipText);
  };

  const handleReset = () => {
    setMessages([INITIAL_GREETING]);
    setInput('');
    setErrorMessage(null);
    setRateLimitCountdown(null);
  };

  const handleFeedback = (messageId: string, type: 'up' | 'down' | 'report') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, feedbackGiven: type } : m))
    );
    trackEvent('assistant_answer_feedback', {
      messageId,
      type,
      question: lastUserPrompt || '',
    });
  };

  const handleScrollToAnchor = (targetAnchor: string) => {
    let targetTab: 'arena' | 'leaderboard' | 'evidence' | 'gallery' | 'methodology' | null = null;
    const lower = targetAnchor.toLowerCase();

    // Special: dataset download action
    if (lower === 'download-dataset' || lower.includes('download')) {
      const downloadLink = document.querySelector('a[download]') as HTMLAnchorElement;
      if (downloadLink) {
        downloadLink.click();
      } else {
        window.location.href = '/api/export?format=csv';
      }
      return;
    }

    if (
      lower === 'gallery' ||
      lower === 'tab-gallery' ||
      lower.startsWith('gallery-') ||
      lower.includes('gallery')
    ) {
      targetTab = 'gallery';
    } else if (
      lower === 'methodology' ||
      lower === 'tab-methodology' ||
      lower.includes('methodology') ||
      lower.includes('bradley') ||
      lower.includes('math') ||
      lower.startsWith('section-')
    ) {
      targetTab = 'methodology';
    } else if (
      lower === 'evidence' ||
      lower === 'tab-evidence'
    ) {
      targetTab = 'evidence';
    } else if (
      lower === 'arena' ||
      lower === 'tab-arena'
    ) {
      targetTab = 'arena';
    } else if (
      lower === 'leaderboard' ||
      lower === 'tab-leaderboard' ||
      lower.startsWith('model-') ||
      lower.includes('openai') ||
      lower.includes('gemini') ||
      lower === 'rankings-table' ||
      lower === 'compare-section' ||
      lower.includes('compare')
    ) {
      targetTab = 'leaderboard';
    } else if (
      lower.startsWith('scenario-') ||
      lower.startsWith('prompt-') ||
      lower === 'scenarios'
    ) {
      if (activeTab !== 'leaderboard' && activeTab !== 'evidence') {
        targetTab = 'leaderboard';
      }
    }

    const performScroll = () => {
      let el: HTMLElement | null = null;

      if (lower === 'gallery' || lower === 'tab-gallery') {
        el = document.getElementById('gallery-root');
      } else if (lower === 'leaderboard' || lower === 'tab-leaderboard') {
        el = document.getElementById('leaderboard-root') || document.getElementById('rankings-table');
      } else if (lower === 'evidence' || lower === 'tab-evidence') {
        el = document.getElementById('evidence-root') || document.getElementById('scenarios');
      } else if (lower === 'methodology' || lower === 'tab-methodology') {
        el = document.getElementById('methodology-root');
      } else if (lower === 'compare-section' || lower.includes('compare')) {
        el = document.getElementById('compare-section');
      } else {
        el = document.getElementById(targetAnchor);
      }

      // Robust fallback resolution
      if (!el) {
        if (lower.includes('bradley') || lower.includes('math') || lower.includes('methodology')) {
          el = document.getElementById('bradley-terry-math') || document.getElementById('methodology-math') || document.getElementById('methodology-root');
        } else if (lower.includes('openai')) {
          el = document.getElementById('model-openai_gpt_image_1');
        } else if (lower.includes('flash')) {
          el = document.getElementById('model-gemini_3_1_flash_lite');
        } else if (lower.includes('pro')) {
          el = document.getElementById('model-gemini_3_pro');
        } else if (lower.includes('gallery')) {
          el = document.getElementById('gallery-root');
        } else if (lower.includes('p0') || lower.includes('p1')) {
          const match = targetAnchor.match(/P[0-1][0-9]/i);
          if (match) {
            el = document.getElementById(`scenario-${match[0].toUpperCase()}`) || document.getElementById(`gallery-${match[0].toUpperCase()}`);
          }
        }
      }

      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Prominent highlight pulse
        el.classList.add('ring-4', 'ring-[#0F2E24]/30', 'ring-offset-4', 'bg-emerald-50/40', 'transition-all');
        setTimeout(() => {
          el?.classList.remove('ring-4', 'ring-[#0F2E24]/30', 'ring-offset-4', 'bg-emerald-50/40');
        }, 3500);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    // On mobile screens (<1024px), close the assistant sheet so the target section is fully visible
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      onOpenChange(false);
    }

    // If target element is on another tab, switch tab first, then scroll
    if (targetTab && targetTab !== activeTab && onNavigateTab) {
      onNavigateTab(targetTab);
      setTimeout(() => {
        performScroll();
      }, 150);
    } else {
      performScroll();
    }
  };

  // Do not render anything if on the blind Arena route (requirement 1)
  if (activeTab === 'arena') {
    return null;
  }

  const chips = SECTION_CHIPS[activeTab] || SECTION_CHIPS.leaderboard;

  return (
    <>
      {/* ─── CLOSED STATE: MINIMAL LAUNCHER PILL ─── */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-30">
          <button
            ref={launcherRef}
            onClick={() => onOpenChange(true)}
            className="group flex items-center gap-2 px-3.5 py-2.5 bg-[#0F2E24] hover:bg-[#163d30] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-[#1b4335] active:scale-95 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F2E24] focus:ring-offset-2"
            aria-label="Open JANEVAL Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Ask JANEVAL</span>
          </button>
        </div>
      )}

      {/* ─── OPEN STATE: DESKTOP DOCKED DRAWER & MOBILE SHEET ─── */}
      {isOpen && (
        <section
          role="dialog"
          aria-labelledby="assistant-title"
          aria-modal="true"
          className="fixed top-0 right-0 bottom-0 w-full lg:w-[420px] bg-white border-l border-[#E3E7E2] z-[60] flex flex-col shadow-2xl animate-in slide-in-from-right duration-250 ease-out"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-[#0F2E24] text-white flex items-center justify-between border-b border-[#1b4335] shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-emerald-300">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h2 id="assistant-title" className="text-xs font-bold text-white tracking-wide">
                JANEVAL Assistant
              </h2>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-900/70 text-emerald-200 border border-emerald-700/60">
                Beta
              </span>

              {/* Info Disclosure Tooltip */}
              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={() => setInfoTooltipOpen((prev) => !prev)}
                  onMouseEnter={() => setInfoTooltipOpen(true)}
                  onMouseLeave={() => setInfoTooltipOpen(false)}
                  aria-label="Assistant disclosure information"
                  className="p-1 text-emerald-200/80 hover:text-white rounded focus:outline-none focus:ring-1 focus:ring-emerald-400 cursor-pointer"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
                {infoTooltipOpen && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-68 p-2.5 bg-[#171A18] text-[#FAFBF9] text-[11px] leading-relaxed rounded-lg shadow-xl border border-white/10 z-50 animate-in fade-in duration-150">
                    AI assistant. Answers come from JANEVAL&apos;s published data and method and can
                    contain mistakes. It is a text model, not one of the evaluated image models.
                  </div>
                )}
              </div>
            </div>

            {/* Action icons */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                title="Restart conversation"
                aria-label="Restart conversation"
                className="p-1.5 text-emerald-200/80 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onOpenChange(false)}
                title="Close assistant"
                aria-label="Close assistant"
                className="p-1.5 text-emerald-200/80 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Conversation Body */}
          <div
            className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#F7F8F5]/60"
            aria-live="polite"
            aria-atomic="false"
          >
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col text-xs ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[90%] rounded-xl px-3.5 py-2.5 leading-relaxed shadow-2xs ${
                    m.sender === 'user'
                      ? 'bg-[#0F2E24] text-white rounded-br-xs'
                      : 'bg-white border border-[#E3E7E2] text-[#171A18] rounded-bl-xs'
                  }`}
                >
                  {/* Short plain answer */}
                  <div className="text-[12px] break-words text-[#171A18] dark:text-[#171A18]">
                    <span className={m.sender === 'user' ? 'text-white' : 'text-[#171A18]'}>
                      {m.plainAnswer}
                    </span>
                  </div>

                  {/* Collapsible Details & Method Expander (if present) */}
                  {m.details && (
                    <details className="mt-2.5 rounded-lg bg-[#FAFBF9] border border-[#E3E7E2] p-2.5 text-[11px] text-[#4B5563] group">
                      <summary className="cursor-pointer font-semibold text-[#0F2E24] hover:underline flex items-center gap-1 select-none">
                        <ChevronRight className="w-3 h-3 group-open:rotate-90 transition-transform shrink-0" />
                        <span>Details &amp; Methodology</span>
                      </summary>
                      <div className="mt-2 pt-2 border-t border-[#E3E7E2] whitespace-pre-wrap leading-relaxed text-[#4B5563]">
                        {m.details}
                      </div>
                    </details>
                  )}

                  {/* "Show on page" link (if targetAnchor provided) */}
                  {m.targetAnchor && (
                    <div className="mt-2.5 pt-2 border-t border-[#E3E7E2]">
                      <button
                        type="button"
                        onClick={() => handleScrollToAnchor(m.targetAnchor!)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#DDEBE3] hover:bg-[#cbe0d4] text-[#0F2E24] text-[11px] font-semibold transition-all cursor-pointer border border-[#C6DDD1] shadow-2xs active:scale-95 group"
                        title={`Navigate to ${m.targetLabel || 'section on page'}`}
                      >
                        <span>{m.targetLabel || 'Show on page'}</span>
                        <ExternalLink className="w-3 h-3 text-[#0F2E24] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  )}

                  {/* Timestamp if present (none on greeting) */}
                  {m.timestamp && (
                    <span
                      className={`block text-[9px] mt-1 text-right ${
                        m.sender === 'user' ? 'text-emerald-200/70' : 'text-[#69716B]'
                      }`}
                    >
                      {m.timestamp}
                    </span>
                  )}
                </div>

                {/* Follow-up question chips */}
                {m.sender === 'assistant' && m.followUps && m.followUps.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                    {m.followUps.map((fu, fuIdx) => (
                      <button
                        key={fuIdx}
                        type="button"
                        onClick={() => handleChipClick(fu)}
                        className="text-left text-[10px] px-2 py-1 rounded-md bg-white hover:bg-[#DDEBE3] text-[#0F2E24] border border-[#E3E7E2] hover:border-[#4E8F6F] transition-colors cursor-pointer"
                      >
                        {fu}
                      </button>
                    ))}
                  </div>
                )}

                {/* Thumbs up / down feedback & Report an error */}
                {m.sender === 'assistant' && m.id !== 'greeting' && (
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-[#69716B] px-1">
                    {m.feedbackGiven ? (
                      <span className="text-[10px] text-[#4E8F6F] font-medium">
                        ✓ Thanks for your feedback
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleFeedback(m.id, 'up')}
                          aria-label="Helpful answer"
                          title="Helpful"
                          className="hover:text-[#0F2E24] cursor-pointer p-0.5 rounded transition-colors"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFeedback(m.id, 'down')}
                          aria-label="Unhelpful answer"
                          title="Unhelpful"
                          className="hover:text-[#0F2E24] cursor-pointer p-0.5 rounded transition-colors"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFeedback(m.id, 'report')}
                          className="hover:text-[#C85A32] underline text-[10px] cursor-pointer ml-1"
                        >
                          Report an error
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Loading / Typing indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs">
                <div className="bg-white border border-[#E3E7E2] rounded-xl px-3.5 py-2.5 text-[11px] text-[#4B5563] flex items-center gap-2 shadow-2xs">
                  <span className="inline-block w-1.5 h-1.5 bg-[#4E8F6F] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="inline-block w-1.5 h-1.5 bg-[#4E8F6F] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="inline-block w-1.5 h-1.5 bg-[#4E8F6F] rounded-full animate-bounce" />
                  <span className="text-[11px] ml-1">Analyzing benchmark dataset...</span>
                </div>
              </div>
            )}

            {/* Error Message with Retry */}
            {errorMessage && (
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
                <div className="flex-1">
                  <span>{errorMessage}</span>
                  {lastUserPrompt && (
                    <button
                      type="button"
                      onClick={handleRetry}
                      className="ml-2 font-semibold underline hover:text-rose-950 cursor-pointer inline-flex items-center gap-0.5"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      Retry
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Rate limit live countdown banner */}
            {rateLimitCountdown !== null && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px]">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                <span>Rate limit reached. Please wait {rateLimitCountdown}s before sending another question.</span>
              </div>
            )}

            {/* Contextual starter chips (ordered plain first, then technical) */}
            {messages.length <= 2 && !isLoading && (
              <div className="pt-2">
                <p className="text-[10px] font-semibold text-[#4B5563] uppercase tracking-wider mb-2">
                  Suggested Questions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {chips.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleChipClick(chip)}
                      className="text-left text-[11px] px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#DDEBE3] text-[#0F2E24] border border-[#E3E7E2] hover:border-[#4E8F6F] transition-all duration-150 cursor-pointer shadow-2xs"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <div className="p-3 pb-6 sm:pb-3 bg-white border-t border-[#E3E7E2] shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-1.5"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about benchmark results or method..."
                maxLength={350}
                disabled={isLoading || rateLimitCountdown !== null}
                className="flex-1 text-xs px-3 py-2 rounded-lg bg-[#FAFBF9] border border-[#E3E7E2] focus:outline-none focus:border-[#0F2E24] focus:ring-1 focus:ring-[#0F2E24] placeholder:text-[#69716B] disabled:opacity-50 text-[#171A18]"
                aria-label="Question input"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading || rateLimitCountdown !== null}
                className="w-8 h-8 rounded-lg bg-[#0F2E24] hover:bg-[#163d30] disabled:bg-[#E3E7E2] text-white disabled:text-[#69716B] flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed shadow-2xs flex-shrink-0"
                aria-label="Send question"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Character counter shown ONLY near limit (>280 chars) and OUTSIDE field */}
            {input.length >= 280 && (
              <div className="mt-1 flex justify-end">
                <span className="text-[10px] font-mono text-[#C85A32] font-semibold">
                  {input.length} / 350
                </span>
              </div>
            )}

            {/* Privacy notice */}
            <p className="text-[10px] text-[#4B5563] text-center mt-1.5 leading-tight">
              Messages are processed by Google Gemini and not stored for training. Do not enter sensitive info.
            </p>

            {/* Provider and Limits notice at readable size */}
            <div className="mt-2 pt-1.5 border-t border-[#E3E7E2] flex items-center justify-between text-[10px] text-[#4B5563] px-0.5">
              <span>Powered by Google Gemini 3.5 Flash-Lite</span>
              <span>Max 350 chars • 8 req/min</span>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
