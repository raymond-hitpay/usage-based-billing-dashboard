"use client";

import * as React from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Maximize2,
  Minimize2,
  ClipboardList,
  Target,
  TriangleAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  SETUP_GROUPS,
  countRemaining,
  countTotal,
  isAllComplete,
  nextIncompleteStep,
  type SetupGroup,
} from "@/lib/setup-guide-data";

interface SetupGuideFloatingProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  groups?: SetupGroup[];
}

function GroupRow({
  group,
  onNavigate,
}: {
  group: SetupGroup;
  onNavigate: (page: string) => void;
}) {
  const allDone = group.steps.every((s) => s.completed);
  const [expanded, setExpanded] = React.useState(!allDone);

  return (
    <div>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left hover:bg-slate-50 transition-colors"
      >
        <span
          className={cn(
            "text-sm font-semibold",
            allDone ? "text-slate-400 line-through" : "text-slate-800"
          )}
        >
          {group.title}
        </span>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>

      {expanded && (
        <ul className="bg-slate-50/70 px-4 pb-3 pt-1 space-y-3">
          {group.steps.map((step) => {
            const isVerifying = step.verificationStatus === "verifying";
            const isVerified = step.verificationStatus === "verified" || step.completed;
            return (
              <li key={step.id} className="flex items-start gap-3">
                {/* Circle / check / spinner */}
                {isVerifying ? (
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-500" />
                  </span>
                ) : (
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 bg-white">
                    {isVerified && (
                      <Check className="h-3 w-3 text-blue-600" strokeWidth={3} />
                    )}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "text-sm",
                        isVerified && !step.categories
                          ? "text-slate-400 line-through"
                          : isVerifying
                          ? "font-medium text-slate-800"
                          : "font-medium text-slate-800"
                      )}
                    >
                      {step.label}
                    </span>
                    {step.navigatesTo && (
                      <button
                        onClick={() => onNavigate(step.navigatesTo!)}
                        className="shrink-0 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        {step.categories ? "Manage →" : "Proceed →"}
                      </button>
                    )}
                  </div>
                  {isVerifying && (
                    <p className="text-xs italic text-amber-600 mt-0.5">Verifying…</p>
                  )}
                  {step.categories && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {step.categories.map((cat) => (
                        <span
                          key={cat.id}
                          className={cn(
                            "rounded-full border px-1.5 py-0.5 text-[9px] font-semibold",
                            cat.enabled
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-50 text-slate-400 border-slate-200"
                          )}
                        >
                          {cat.enabled ? "✓ " : ""}{cat.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function SetupGuideFloating({
  open,
  onClose,
  onNavigate,
  groups: groupsProp,
}: SetupGuideFloatingProps) {
  const groups = groupsProp ?? SETUP_GROUPS;
  const remaining = countRemaining(groups);
  const allDone = isAllComplete(groups);
  const total = groups.flatMap((g) => g.steps).length;
  const completed = total - remaining;
  const progressPct = Math.round((completed / total) * 100);

  if (!open) {
    return (
      <button
        onClick={() => {/* handled by parent toggle */}}
        className="hidden"
      />
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 w-80 rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <TriangleAlert className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-semibold text-slate-900">
            Finish your setup
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label="Collapse"
        >
          <Minimize2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* All done state */}
      {allDone ? (
        <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <Target className="h-7 w-7 text-emerald-500" />
          </div>
          <div>
            <p className="font-semibold text-slate-900">You're ready to go!</p>
            <p className="mt-1 text-sm text-slate-500">
              Your account is fully set up.
            </p>
          </div>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View more resources →
          </button>
        </div>
      ) : (
        <>
          {/* Progress bar */}
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="mb-1.5">
              <span className="text-xs text-slate-500">
                {completed} of {total} complete
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100">
              <div
                className="h-1.5 rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Groups */}
          <div className="divide-y divide-slate-100">
            {groups.map((group) => (
              <GroupRow key={group.id} group={group} onNavigate={onNavigate} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Collapsed card ────────────────────────────────────────────────── */
export function SetupGuidePill({
  onClick,
  onNavigate,
  groups: groupsProp,
}: {
  onClick: () => void;
  onNavigate: (page: string) => void;
  groups?: SetupGroup[];
}) {
  const groups = groupsProp ?? SETUP_GROUPS;
  const remaining = countRemaining(groups);
  const total = countTotal(groups);
  const completed = total - remaining;
  const allDone = isAllComplete(groups);
  const next = nextIncompleteStep(groups);
  const progressPct = Math.round((completed / total) * 100);

  return (
    <div className="fixed bottom-5 right-5 z-50 w-60 rounded-xl border border-slate-200 bg-white shadow-xl shadow-slate-900/10 overflow-hidden">
      {/* Header row */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-1.5">
          <TriangleAlert className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-semibold text-slate-900">Finish your setup</span>
        </div>
        <button
          onClick={onClick}
          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          aria-label="Expand"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mx-4 h-1 rounded-full bg-slate-100">
        <div
          className="h-1 rounded-full bg-blue-600 transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Next step */}
      <div className="px-4 pt-2 pb-3">
        {allDone ? (
          <p className="text-sm text-slate-500">
            All steps complete 🎉
          </p>
        ) : next ? (
          <p className="flex items-center gap-1.5 text-sm text-slate-500">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <button
              onClick={() => next.navigatesTo && onNavigate(next.navigatesTo)}
              className="font-medium text-slate-700 hover:text-blue-700 hover:underline transition-colors"
            >
              {next.label}
            </button>
          </p>
        ) : null}
      </div>
    </div>
  );
}
