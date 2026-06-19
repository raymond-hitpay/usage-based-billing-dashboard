"use client";

import * as React from "react";
import Image from "next/image";
import { ChevronLeft, ChevronDown, Sparkles } from "lucide-react";
import {
  NavList,
  resolveSections,
  tabsMeta,
  type SubView,
  type TabId,
} from "./nav-config";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "@/lib/utils";

export type PricingModel = "volume" | "graduated";

export interface SidebarV2Props {
  activeTab: TabId;
  subView: SubView;
  selectedPage: string;
  onChangeTab: (tab: TabId) => void;
  onSubViewChange: (view: SubView) => void;
  onSelectPage: (label: string) => void;
  onOpenAgent: () => void;
  pricingModel: PricingModel;
  onPricingModelChange: (model: PricingModel) => void;
}

export function SidebarV2({
  activeTab,
  subView,
  selectedPage,
  onChangeTab,
  onSubViewChange,
  onSelectPage,
  onOpenAgent,
  pricingModel,
  onPricingModelChange,
}: SidebarV2Props) {
  const sections = resolveSections(activeTab, subView);
  const viewKey = `${activeTab}:${subView ?? "main"}`;
  const activeTabLabel =
    tabsMeta.find((t) => t.id === activeTab)?.label ?? "";

  return (
    <aside className="flex h-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Rail 1 — icon rail */}
      <div className="flex w-[72px] flex-col items-center border-r border-slate-200 bg-slate-50/60 pt-3">
        <div className="mb-3 flex h-9 w-9 items-center justify-center text-[#0E2859]">
          <Image
            src="/hitpay-mark.svg"
            alt="HitPay"
            width={28}
            height={28}
            priority
          />
        </div>
        <div className="mb-3 h-px w-8 bg-slate-200" />
        <ul className="flex w-full flex-col items-center gap-1 px-2">
          {tabsMeta.map((tab) => {
            const Icon = tab.icon;
            const active = tab.id === activeTab;
            return (
              <li key={tab.id} className="w-full">
                <button
                  onClick={() => onChangeTab(tab.id)}
                  aria-label={tab.label}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex w-full flex-col items-center gap-1 rounded-xl px-1 py-2 transition-all",
                    active
                      ? cn(tab.activeTile, tab.activeText, "shadow-sm")
                      : cn("text-slate-500", tab.inactiveHover)
                  )}
                >
                  <Icon
                    className={cn(
                      "h-[18px] w-[18px] transition-transform",
                      active ? tab.iconClass : "",
                      !active && "group-hover:scale-110"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium leading-none tracking-tight",
                      active ? tab.activeText : "text-slate-500"
                    )}
                  >
                    {tab.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="mt-auto flex w-full justify-center border-t border-slate-200 px-2 py-2">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onOpenAgent}
                  aria-label="Ask Agent"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-indigo-500 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <Sparkles className="h-[18px] w-[18px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Ask Agent</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Rail 2 — items rail */}
      <div className="flex w-56 flex-col">
        <div className="px-3 pb-1 pt-3">
          {subView === "settings" ? (
            <button
              onClick={() => onSubViewChange(null)}
              className="group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-slate-100"
              aria-label="Back to main menu"
            >
              <ChevronLeft className="h-4 w-4 text-slate-500 transition-transform group-hover:-translate-x-0.5 group-hover:text-slate-900" />
              <span className="text-sm font-semibold text-slate-900">
                Settings
              </span>
            </button>
          ) : (
            <div className="px-2 py-1.5 text-sm font-semibold text-slate-900">
              {activeTabLabel}
            </div>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-2 pt-1 text-sm">
          <div
            key={viewKey}
            className="animate-in fade-in slide-in-from-left-2 duration-200"
          >
            <NavList
              sections={sections}
              selectedPage={selectedPage}
              onSelectPage={onSelectPage}
              onNavigate={(t) => onSubViewChange(t)}
            />

            {/* Pricing model toggle — visible in settings when Usage/Billing is selected */}
            {subView === "settings" && (
              <div className="mt-4 px-2">
                <div className="mb-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                  Pricing model
                </div>
                <div className="flex rounded-lg bg-slate-100 p-0.5">
                  {(["volume", "graduated"] as const).map((model) => (
                    <button
                      key={model}
                      onClick={() => onPricingModelChange(model)}
                      className={cn(
                        "flex-1 rounded-md px-2 py-1 text-[11px] font-medium transition-all",
                        pricingModel === model
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      {model === "volume" ? "Volume" : "Graduated"}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* User + workspace switcher (pinned) */}
        <div className="border-t border-slate-200 px-3 py-2">
          <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-100">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[11px] font-medium text-slate-700">
              N
            </span>
            <span className="min-w-0 flex-1 truncate text-sm text-slate-900">
              <span className="font-medium">Nitin</span>
              <span className="mx-1.5 text-slate-300">·</span>
              <span className="text-slate-500">My Cat Shop</span>
            </span>
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          </button>
        </div>
      </div>
    </aside>
  );
}
