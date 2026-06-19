"use client";

import * as React from "react";
import { X, ArrowUp, Sparkles, History, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTIONS = [
  "Show me this week's sales",
  "Create a payment link for SGD 50",
  "How many refunds happened last month?",
  "Summarize my top 5 customers",
];

interface AgentPanelProps {
  open: boolean;
  onClose: () => void;
}

export function AgentPanel({ open, onClose }: AgentPanelProps) {
  const [input, setInput] = React.useState("");

  return (
    <aside
      aria-hidden={!open}
      className={cn(
        "shrink-0 overflow-hidden transition-[width] duration-300 ease-out",
        open ? "w-[400px]" : "w-0"
      )}
    >
      <div className="flex h-full w-[400px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-900">
                Agent
              </span>
              <span className="text-[11px] text-slate-500">
                Your HitPay assistant
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
              aria-label="History"
            >
              <History className="h-4 w-4" />
            </button>
            <button
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
              aria-label="Agent settings"
            >
              <Settings2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <div className="mb-4">
            <div className="mb-1 text-base font-semibold text-slate-900">
              Hi, what can I help with?
            </div>
            <div className="text-sm text-slate-500">
              I can answer questions about your business, draft payment links,
              summarize transactions, and more.
            </div>
          </div>

          <div className="space-y-2">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Suggested
            </div>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-left text-sm text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="border-t bg-white p-3">
          <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-blue-100">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Agent anything…"
              rows={1}
              className="max-h-32 flex-1 resize-none bg-transparent py-1 text-sm outline-none placeholder:text-slate-400"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  setInput("");
                }
              }}
            />
            <button
              disabled={!input.trim()}
              className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-white transition-colors hover:bg-slate-700 disabled:bg-slate-200 disabled:text-slate-400"
              aria-label="Send"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1.5 px-1 text-[10px] text-slate-400">
            Agent can make mistakes. Verify important info.
          </p>
        </div>
      </div>
    </aside>
  );
}
