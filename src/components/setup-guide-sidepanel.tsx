"use client";

import * as React from "react";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  SETUP_GROUPS,
  countRemaining,
  type SetupGroup,
} from "@/lib/setup-guide-data";

interface SetupGuideSidePanelProps {
  open: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  groups?: SetupGroup[];
}

function GroupSection({
  group,
  onNavigate,
}: {
  group: SetupGroup;
  onNavigate: (page: string) => void;
}) {
  const allDone = group.steps.every((s) => s.completed);
  const [expanded, setExpanded] = React.useState(!allDone);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span
          className={cn(
            "font-semibold",
            allDone ? "text-slate-400 line-through" : "text-slate-900"
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
        <ul className="pb-4 space-y-0">
          {group.steps.map((step) => (
            <li
              key={step.id}
              className={cn(
                "flex items-start gap-4 px-6 py-3",
                !step.completed && "bg-slate-50/60"
              )}
            >
              {/* Icon */}
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 bg-white">
                {step.completed && (
                  <Check className="h-3.5 w-3.5 text-blue-600" strokeWidth={3} />
                )}
              </span>
              <div className="flex flex-1 items-start justify-between gap-4 min-w-0">
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "font-medium",
                      step.completed && !step.categories ? "text-slate-400 line-through" : "text-slate-900"
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {step.description}
                  </p>
                  {step.categories && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
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
                {step.navigatesTo && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    onClick={() => onNavigate(step.navigatesTo!)}
                  >
                    {step.categories ? "Manage" : "Proceed"}
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SetupGuideSidePanel({
  open,
  onClose,
  onNavigate,
  groups: groupsProp,
}: SetupGuideSidePanelProps) {
  const groups = groupsProp ?? SETUP_GROUPS;
  const remaining = countRemaining(groups);

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px] transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out sm:w-[420px]",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Pending tasks
            </h2>
            {remaining > 0 && (
              <p className="mt-0.5 text-sm text-slate-500">
                {remaining} action{remaining !== 1 ? "s" : ""} required
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Groups */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {groups.map((group) => (
            <GroupSection key={group.id} group={group} onNavigate={onNavigate} />
          ))}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-6 py-4">
          <p className="text-sm text-slate-400 text-center">
            Complete all steps to unlock the full potential of your HitPay account
          </p>
        </div>
      </div>
    </>
  );
}
