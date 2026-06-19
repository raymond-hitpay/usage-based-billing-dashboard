"use client";

import * as React from "react";
import { Plus, Sparkles, Store, ScanLine, Smartphone, Send, Clock, Bell, RefreshCw, CalendarDays, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DummyPageProps {
  title: string;
}

type FeatureCard = { icon: React.ElementType; label: string; color: string; bg: string };

const FEATURE_CARDS: Record<string, FeatureCard[]> = {
  "Static QRs": [
    { icon: Store, label: "Display at checkout in-store", color: "text-orange-600", bg: "bg-orange-50" },
    { icon: ScanLine, label: "Reusable for any transaction amount", color: "text-teal-600", bg: "bg-teal-50" },
    { icon: Smartphone, label: "Works with any camera app", color: "text-blue-600", bg: "bg-blue-50" },
  ],
  "Invoicing": [
    { icon: Send, label: "Send professional invoices via email", color: "text-indigo-600", bg: "bg-indigo-50" },
    { icon: Clock, label: "Track & manage payment status", color: "text-amber-600", bg: "bg-amber-50" },
    { icon: Bell, label: "Auto-reminders for overdue invoices", color: "text-rose-600", bg: "bg-rose-50" },
  ],
  "Recurring Billing": [
    { icon: RefreshCw, label: "Automate subscription payments", color: "text-green-600", bg: "bg-green-50" },
    { icon: CalendarDays, label: "Set flexible billing cycles", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: Users, label: "Manage plans & subscribers", color: "text-purple-600", bg: "bg-purple-50" },
  ],
};

const STATS = [
  { label: "This month", value: "—", change: "—" },
  { label: "Last month", value: "—", change: "—" },
  { label: "Year to date", value: "—", change: "—" },
];

export function DummyPage({ title }: DummyPageProps) {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Page header */}
      <div className="flex items-center justify-between border-b px-8 py-5">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Manage and monitor your {title.toLowerCase()} activity.
          </p>
        </div>
        <Button size="sm" className="h-9">
          <Plus className="h-4 w-4" />
          New
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="grid grid-cols-3 gap-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="text-xs font-medium text-slate-500">
                {stat.label}
              </div>
              <div className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">
                {stat.value}
              </div>
              <div className="mt-1 text-xs text-slate-400">
                vs previous period {stat.change}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex h-[360px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
            <Sparkles className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-3 text-base font-medium text-slate-900">
            {title} is coming soon
          </div>
          <div className="mt-1 max-w-sm text-sm text-slate-500">
            This page is part of the new HitPay design exploration. Real
            content for {title} will appear here.
          </div>
        </div>

        {FEATURE_CARDS[title] && (
          <div className="mt-6 grid grid-cols-3 gap-3 max-w-lg">
            {FEATURE_CARDS[title].map((card) => (
              <div key={card.label} className="rounded-xl border border-slate-200 bg-white px-4 py-4 text-center shadow-sm">
                <div className={`mx-auto mb-2.5 flex h-8 w-8 items-center justify-center rounded-full ${card.bg}`}>
                  <card.icon className={`h-4 w-4 ${card.color}`} />
                </div>
                <p className="text-xs font-medium text-slate-700 leading-snug">{card.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
