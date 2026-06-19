"use client";

import * as React from "react";
import Image from "next/image";
import {
  CreditCard,
  ShoppingBag,
  Wallet,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TabId } from "./sidebar";

const tabs: {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
}[] = [
  { id: "payments", label: "Payments", icon: CreditCard, iconClass: "text-blue-600" },
  { id: "commerce", label: "Commerce", icon: ShoppingBag, iconClass: "text-amber-600" },
  { id: "finance", label: "Finance", icon: Wallet, iconClass: "text-emerald-600" },
];

interface TopBarProps {
  activeTab: TabId;
  onChangeTab: (id: TabId) => void;
  onOpenAgent: () => void;
}

export function TopBar({ activeTab, onChangeTab, onOpenAgent }: TopBarProps) {
  return (
    <div className="flex items-center px-4 py-2.5">
      {/* Brand */}
      <div className="flex w-56 items-center">
        <Image
          src="/hitpay-logo.svg"
          alt="HitPay"
          width={88}
          height={22}
          priority
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:bg-slate-200/60 hover:text-slate-700"
              )}
            >
              <Icon className={cn("h-4 w-4", active ? tab.iconClass : "")} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={onOpenAgent}
          className="group flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50"
        >
          <Sparkles className="h-4 w-4 text-indigo-500 group-hover:text-indigo-600" />
          <span>Ask Agent</span>
        </button>
      </div>
    </div>
  );
}
