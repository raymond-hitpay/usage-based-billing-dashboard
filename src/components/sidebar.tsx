"use client";

import * as React from "react";
import { ChevronLeft, ChevronDown } from "lucide-react";
import {
  NavList,
  resolveSections,
  type SubView,
  type TabId,
} from "./nav-config";

export type { SubView, TabId };

export interface SidebarProps {
  activeTab: TabId;
  subView: SubView;
  selectedPage: string;
  onSubViewChange: (view: SubView) => void;
  onSelectPage: (label: string) => void;
}

export function Sidebar({
  activeTab,
  subView,
  selectedPage,
  onSubViewChange,
  onSelectPage,
}: SidebarProps) {
  const sections = resolveSections(activeTab, subView);
  const viewKey = subView ?? activeTab;

  return (
    <aside className="flex h-full w-60 flex-col bg-transparent">
      {subView === "settings" && (
        <div className="px-3 pb-1 pt-3">
          <button
            onClick={() => onSubViewChange(null)}
            className="group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-slate-200/60"
            aria-label="Back to main menu"
          >
            <ChevronLeft className="h-4 w-4 text-slate-500 transition-transform group-hover:-translate-x-0.5 group-hover:text-slate-900" />
            <span className="text-sm font-semibold text-slate-900">
              Settings
            </span>
          </button>
        </div>
      )}
      <nav className="flex-1 overflow-y-auto px-3 pb-2 pt-2 text-sm">
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
        </div>
      </nav>

      {/* User + workspace switcher (pinned) */}
      <div className="px-3 pt-2">
        <button className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-left transition-colors hover:bg-slate-50">
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
    </aside>
  );
}
