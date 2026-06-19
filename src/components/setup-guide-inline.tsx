"use client";

import * as React from "react";
import { Check, Clock, X, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  countTotal,
  countRemaining,
  isAllComplete,
  type SetupGroup,
} from "@/lib/setup-guide-data";

interface SetupGuideInlineProps {
  groups: SetupGroup[];
  onNavigate: (page: string) => void;
}

export function SetupGuideInline({ groups, onNavigate }: SetupGuideInlineProps) {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  const total = countTotal(groups);
  const remaining = countRemaining(groups);
  const completed = total - remaining;
  const allDone = isAllComplete(groups);

  if (allDone) {
    return (
      <div className="relative rounded-xl border border-green-200 bg-green-50 px-6 py-5">
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full text-green-400 hover:bg-green-100 hover:text-green-600 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500">
            <PartyPopper className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-green-900">You're all set!</p>
            <p className="mt-1 text-sm text-green-700">
              Your account is ready. You can now accept payments and payouts.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const progressPct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 px-6 py-5">
      {/* Header */}
      <div className="mb-1 flex items-center justify-between">
        <p className="text-sm font-bold text-blue-900">Finish your setup</p>
        <p className="text-xs text-blue-500">
          {completed} of {total} steps complete
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-blue-200">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Groups */}
      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          <div key={group.id}>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-blue-400">
              {group.title}
            </p>
            <div className="flex flex-col gap-1">
              {group.steps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg bg-white px-3 py-2.5",
                    step.completed && "opacity-50"
                  )}
                >
                  {/* Status icon */}
                  {step.completed ? (
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  ) : step.verificationStatus === "verifying" ? (
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-amber-400 bg-amber-50">
                      <Clock className="h-3 w-3 text-amber-500" />
                    </div>
                  ) : (
                    <div className="h-5 w-5 shrink-0 rounded-full border-2 border-slate-300" />
                  )}

                  {/* Label + categories */}
                  <div className="flex-1 min-w-0">
                    <span
                      className={cn(
                        "text-sm",
                        step.completed && !step.categories
                          ? "text-slate-400 line-through"
                          : step.verificationStatus === "verifying"
                          ? "text-amber-700"
                          : "text-slate-700"
                      )}
                    >
                      {step.label}
                      {step.verificationStatus === "verifying" && (
                        <span className="ml-1.5 text-xs italic text-amber-500">Verifying…</span>
                      )}
                    </span>
                    {/* Category tags */}
                    {step.categories && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {step.categories.map((cat) => (
                          <span
                            key={cat.id}
                            className={cn(
                              "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
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

                  {/* CTA */}
                  {step.navigatesTo && (
                    <button
                      onClick={() => onNavigate(step.navigatesTo!)}
                      aria-label={`Manage ${step.label}`}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors shrink-0"
                    >
                      {step.categories ? "Manage →" : step.completed ? null : "Start →"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
