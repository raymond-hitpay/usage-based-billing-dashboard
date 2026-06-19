"use client";

import * as React from "react";
import { CheckCircle, Store, ScanLine, Smartphone, Send, Clock, Bell, RefreshCw, CalendarDays, Users } from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   Shared layout shell
───────────────────────────────────────────────────────────────────────────── */

interface FeatureCardData {
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  illustration: React.ReactNode;
}

function EmptyPageShell({
  pageTitle,
  headline,
  subtitle,
  onActivate,
  ctaLabel,
  splitCardEyebrow,
  splitCardTitle,
  splitCardBullets,
  splitCardIllustration,
  featureCards,
}: {
  pageTitle: string;
  headline: string;
  subtitle: string;
  onActivate?: () => void;
  ctaLabel?: string;
  splitCardEyebrow: string;
  splitCardTitle: string;
  splitCardBullets: string[];
  splitCardIllustration: React.ReactNode;
  featureCards: FeatureCardData[];
}) {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5">
        <h1 className="text-xl font-semibold text-slate-900">{pageTitle}</h1>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col items-center overflow-y-auto px-8 py-12 gap-10">

        {/* ① Hero */}
        <div className="text-center max-w-lg">
          <h2 className="text-2xl font-bold text-slate-900 leading-snug">{headline}</h2>
          <p className="mt-2.5 text-sm text-slate-500 leading-relaxed">{subtitle}</p>
          <button
            onClick={onActivate}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            {ctaLabel ?? "Activate Account"}
          </button>
        </div>

        {/* ② Split card */}
        <div className="w-full max-w-2xl h-[220px] rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden flex">
          {/* Left */}
          <div className="flex flex-col justify-center px-8 py-8 flex-1 gap-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">{splitCardEyebrow}</p>
              <p className="text-base font-semibold text-slate-900">{splitCardTitle}</p>
            </div>
            <div className="flex flex-col gap-3">
              {splitCardBullets.map(item => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Right */}
          <div className="flex items-center justify-center bg-white/60 px-8 py-6 shrink-0">
            {splitCardIllustration}
          </div>
        </div>

        {/* ③ Feature cards */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
          {featureCards.map(card => (
            <div key={card.title} className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="flex items-start gap-3 px-4 pt-4 pb-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${card.iconBg}`}>
                  <card.icon className={`h-4 w-4 ${card.iconColor}`} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-slate-800 leading-snug">{card.title}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">{card.subtitle}</p>
                </div>
              </div>
              <div className="mx-4 mb-3 flex-1 rounded-xl overflow-hidden">
                {card.illustration}
              </div>
              <div className="px-4 pb-4">
                <a href="#" className="text-[11px] font-medium text-blue-600 hover:underline">Learn More →</a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Static QRs
───────────────────────────────────────────────────────────────────────────── */

function QrGrid({ size = 5, cellPx = 5 }: { size?: number; cellPx?: number }) {
  const cells = React.useMemo(
    () => Array.from({ length: size * size }, () => Math.random() > 0.45),
    []
  );
  return (
    <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(${size}, ${cellPx}px)` }}>
      {cells.map((filled, i) => (
        <div key={i} className={`rounded-[1px] ${filled ? "bg-slate-900" : "bg-white"}`} style={{ width: cellPx, height: cellPx }} />
      ))}
    </div>
  );
}

export function StaticQRsEmptyPage({ onActivate }: { onActivate?: () => void }) {
  return (
    <EmptyPageShell
      pageTitle="Static QRs"
      headline="Accept payments with a single scan"
      subtitle="Print once, reuse forever. No terminal or hardware required — just display your QR and get paid."
      onActivate={onActivate}
      splitCardEyebrow="Static QRs"
      splitCardTitle="One QR code, unlimited payments"
      splitCardBullets={[
        "Display at your counter or print on receipts",
        "Reusable for any transaction amount",
        "Works with any camera app — no extra app needed",
      ]}
      splitCardIllustration={
        <div className="flex items-center gap-4">
          {/* Printed QR stand mockup */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="rounded-xl border border-slate-200 bg-white shadow-md p-3 flex flex-col items-center gap-2">
              <p className="text-[8px] font-semibold text-slate-500 uppercase tracking-wide">Scan to Pay</p>
              <div className="rounded bg-white p-1.5 border border-slate-100">
                <QrGrid size={7} cellPx={6} />
              </div>
              <p className="text-[7px] text-slate-400">hitpay.me/myshop</p>
            </div>
            <div className="w-2 h-5 bg-slate-300 rounded-b" />
            <div className="w-10 h-1 bg-slate-300 rounded" />
          </div>
          {/* Phone scanning */}
          <div className="w-[72px] rounded-[12px] border-2 border-slate-800 bg-slate-900 shadow-xl overflow-hidden shrink-0">
            <div className="flex justify-center pt-1.5 pb-0.5">
              <div className="h-1 w-5 rounded-full bg-slate-700" />
            </div>
            <div className="px-1.5 pb-2.5 space-y-1">
              <div className="rounded bg-slate-800 px-1 py-1 flex items-center justify-center">
                <p className="text-[6px] text-slate-400">Scanning…</p>
              </div>
              <div className="rounded bg-white p-1 flex items-center justify-center relative">
                <QrGrid size={5} cellPx={4} />
                {/* scan line */}
                <div className="absolute inset-x-1 top-1/2 h-[1px] bg-blue-500/60" />
              </div>
              <div className="rounded bg-blue-600 py-0.5 text-center text-[6px] font-semibold text-white">
                SGD 25.00 ✓
              </div>
            </div>
          </div>
        </div>
      }
      featureCards={[
        {
          icon: Store,
          iconColor: "text-orange-600",
          iconBg: "bg-orange-50",
          title: "Display at checkout in-store",
          subtitle: "Print or display digitally at your counter.",
          illustration: (
            <div className="bg-orange-50 px-3 py-3 space-y-1.5">
              <div className="rounded-lg bg-white border border-orange-100 p-2 flex items-center gap-2">
                <div className="rounded bg-white border border-slate-100 p-1 shrink-0">
                  <QrGrid size={4} cellPx={4} />
                </div>
                <div>
                  <p className="text-[8px] font-semibold text-slate-700">My Shop</p>
                  <p className="text-[7px] text-slate-400">Scan to pay</p>
                </div>
              </div>
              <div className="flex gap-1">
                <div className="flex-1 rounded bg-orange-100 py-1 text-center text-[7px] text-orange-700">Counter</div>
                <div className="flex-1 rounded bg-orange-100 py-1 text-center text-[7px] text-orange-700">Receipt</div>
                <div className="flex-1 rounded bg-orange-100 py-1 text-center text-[7px] text-orange-700">Menu</div>
              </div>
            </div>
          ),
        },
        {
          icon: ScanLine,
          iconColor: "text-teal-600",
          iconBg: "bg-teal-50",
          title: "Reusable for any amount",
          subtitle: "Customer enters the amount at checkout.",
          illustration: (
            <div className="bg-teal-50 px-3 py-3 space-y-1.5">
              <p className="text-[9px] text-teal-600 font-medium">Customer enters amount</p>
              <div className="flex items-center gap-1.5 rounded-lg bg-white border border-teal-200 px-2.5 py-1.5">
                <span className="text-[9px] font-bold text-teal-600">SGD</span>
                <span className="text-[13px] font-bold text-slate-800 font-mono">—</span>
              </div>
              <div className="flex gap-1.5">
                {["$10","$50","Any"].map(a => (
                  <div key={a} className={`flex-1 rounded-md border py-0.5 text-center text-[8px] font-medium ${a === "Any" ? "border-teal-500 bg-teal-500 text-white" : "border-teal-200 text-teal-600"}`}>{a}</div>
                ))}
              </div>
            </div>
          ),
        },
        {
          icon: Smartphone,
          iconColor: "text-blue-600",
          iconBg: "bg-blue-50",
          title: "Works with any camera app",
          subtitle: "No special app download required.",
          illustration: (
            <div className="bg-blue-50 px-3 py-3 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <div className="h-5 w-5 rounded-full bg-blue-400 shrink-0 flex items-center justify-center">
                  <Smartphone className="h-2.5 w-2.5 text-white" />
                </div>
                <div className="flex-1 rounded-full bg-blue-100 px-2 py-1 text-[9px] text-blue-800">Camera opened → link detected</div>
              </div>
              <div className="flex items-center gap-1.5 flex-row-reverse">
                <div className="h-5 w-5 rounded-full bg-slate-300 shrink-0" />
                <div className="rounded-full bg-white border border-slate-200 px-2.5 py-1 text-[9px] text-slate-600">Payment page opened ✅</div>
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Invoicing
───────────────────────────────────────────────────────────────────────────── */

export function InvoicingEmptyPage({ onActivate, pageTitle = "Invoicing" }: { onActivate?: () => void; pageTitle?: string }) {
  return (
    <EmptyPageShell
      pageTitle={pageTitle}
      headline="Get paid faster with professional invoices"
      subtitle="Send, track, and follow up — all in one place. Automated reminders do the chasing for you."
      onActivate={onActivate}
      splitCardEyebrow="Invoicing"
      splitCardTitle="Send invoices, collect payment"
      splitCardBullets={[
        "Send professional invoices via email in seconds",
        "Track payment status in real time",
        "Auto-reminders chase overdue invoices for you",
      ]}
      splitCardIllustration={
        <div className="w-[200px] rounded-lg border border-slate-200 bg-white shadow-md overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-3 py-2">
            <p className="text-[8px] font-semibold text-slate-600">INVOICE #1042</p>
            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[6px] font-semibold text-amber-700">Pending</span>
          </div>
          <div className="p-3 space-y-2">
            <div className="flex justify-between text-[7px] text-slate-400">
              <span>To: Jane Doe</span>
              <span>Due: 15 Jun</span>
            </div>
            <div className="space-y-1">
              {[["Web Design", "SGD 800.00"], ["Hosting (1yr)", "SGD 120.00"]].map(([label, amt]) => (
                <div key={label} className="flex justify-between text-[8px]">
                  <span className="text-slate-600">{label}</span>
                  <span className="text-slate-800 font-medium font-mono">{amt}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-1.5 flex justify-between">
              <span className="text-[8px] font-semibold text-slate-700">Total</span>
              <span className="text-[9px] font-bold text-slate-900 font-mono">SGD 920.00</span>
            </div>
            <div className="rounded bg-blue-600 py-1 text-center text-[8px] font-semibold text-white">
              Pay Now
            </div>
          </div>
        </div>
      }
      featureCards={[
        {
          icon: Send,
          iconColor: "text-indigo-600",
          iconBg: "bg-indigo-50",
          title: "Send invoices via email",
          subtitle: "Professional-looking invoices in seconds.",
          illustration: (
            <div className="bg-indigo-50 px-3 py-3 space-y-1.5">
              <div className="rounded-lg bg-white border border-indigo-100 px-2.5 py-2 space-y-1">
                <p className="text-[8px] text-slate-400">To: jane@example.com</p>
                <p className="text-[8px] font-medium text-slate-700">Invoice #1042 — SGD 920.00</p>
                <div className="rounded bg-indigo-500 py-0.5 text-center text-[7px] font-semibold text-white">View & Pay Invoice</div>
              </div>
              <p className="text-[7px] text-indigo-500 text-center">Sent ✓ — delivered to inbox</p>
            </div>
          ),
        },
        {
          icon: Clock,
          iconColor: "text-amber-600",
          iconBg: "bg-amber-50",
          title: "Track payment status",
          subtitle: "See what's sent, viewed, and paid.",
          illustration: (
            <div className="bg-amber-50 px-3 py-3 space-y-1">
              {[
                { label: "Sent", color: "bg-slate-300", done: true },
                { label: "Viewed", color: "bg-amber-400", done: true },
                { label: "Paid", color: "bg-slate-200", done: false },
              ].map(({ label, color, done }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${color} shrink-0`} />
                  <span className={`text-[9px] ${done ? "text-slate-700 font-medium" : "text-slate-400"}`}>{label}</span>
                  {done && <span className="ml-auto text-[7px] text-slate-400">✓</span>}
                </div>
              ))}
            </div>
          ),
        },
        {
          icon: Bell,
          iconColor: "text-rose-600",
          iconBg: "bg-rose-50",
          title: "Auto-reminders for overdue",
          subtitle: "Automated follow-ups so you don't have to.",
          illustration: (
            <div className="bg-rose-50 px-3 py-3 space-y-1.5">
              <div className="flex items-start gap-1.5 rounded-lg bg-white border border-rose-100 px-2 py-1.5">
                <Bell className="h-3 w-3 text-rose-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[8px] font-medium text-slate-700">Reminder sent</p>
                  <p className="text-[7px] text-slate-400">Invoice #1042 overdue by 3 days</p>
                </div>
              </div>
              <div className="flex gap-1">
                {["Day 1","Day 3","Day 7"].map(d => (
                  <div key={d} className="flex-1 rounded bg-rose-100 py-0.5 text-center text-[6px] text-rose-600">{d}</div>
                ))}
              </div>
            </div>
          ),
        },
      ]}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Recurring Billing
───────────────────────────────────────────────────────────────────────────── */

export function RecurringBillingEmptyPage({ onActivate, pageTitle = "Recurring Billing" }: { onActivate?: () => void; pageTitle?: string }) {
  return (
    <EmptyPageShell
      pageTitle={pageTitle}
      headline="Automate your recurring revenue"
      subtitle="Set up once, collect automatically every billing cycle. No manual follow-up needed."
      onActivate={onActivate}
      splitCardEyebrow="Recurring Billing"
      splitCardTitle="Subscriptions on autopilot"
      splitCardBullets={[
        "Automate subscription and membership payments",
        "Set flexible billing cycles — monthly, yearly, custom",
        "Manage plans and subscribers in one place",
      ]}
      splitCardIllustration={
        <div className="w-[200px] rounded-lg border border-slate-200 bg-white shadow-md overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-3 py-2">
            <p className="text-[8px] font-semibold text-slate-600">Pro Plan</p>
            <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[6px] font-semibold text-green-700">Active</span>
          </div>
          <div className="p-3 space-y-2">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-slate-900 font-mono">SGD 49</span>
              <span className="text-[8px] text-slate-400">/ month</span>
            </div>
            <div className="space-y-1">
              {["Next billing: 1 Jul 2026", "3 active subscribers", "Auto-renews monthly"].map(line => (
                <div key={line} className="flex items-center gap-1.5">
                  <div className="h-1 w-1 rounded-full bg-green-400 shrink-0" />
                  <p className="text-[7px] text-slate-500">{line}</p>
                </div>
              ))}
            </div>
            <div className="rounded bg-green-600 py-1 text-center text-[8px] font-semibold text-white">
              Manage Plan
            </div>
          </div>
        </div>
      }
      featureCards={[
        {
          icon: RefreshCw,
          iconColor: "text-green-600",
          iconBg: "bg-green-50",
          title: "Automate subscription payments",
          subtitle: "Payments collected automatically each cycle.",
          illustration: (
            <div className="bg-green-50 px-3 py-3 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <div className="h-5 w-5 rounded-full bg-green-400 shrink-0 flex items-center justify-center">
                  <RefreshCw className="h-2.5 w-2.5 text-white" />
                </div>
                <div className="flex-1 rounded-full bg-green-100 px-2 py-1 text-[9px] text-green-800">Payment collected ✓</div>
              </div>
              <div className="flex items-center gap-1.5 flex-row-reverse">
                <div className="h-5 w-5 rounded-full bg-slate-300 shrink-0" />
                <div className="rounded-full bg-white border border-slate-200 px-2.5 py-1 text-[9px] text-slate-600">Receipt sent to customer</div>
              </div>
            </div>
          ),
        },
        {
          icon: CalendarDays,
          iconColor: "text-blue-600",
          iconBg: "bg-blue-50",
          title: "Flexible billing cycles",
          subtitle: "Monthly, yearly, or fully custom intervals.",
          illustration: (
            <div className="bg-blue-50 px-3 py-3 space-y-1.5">
              <p className="text-[9px] text-blue-500 font-medium">Billing cycle</p>
              <div className="flex gap-1.5">
                {["Monthly","Yearly","Custom"].map(c => (
                  <div key={c} className={`flex-1 rounded-md border py-0.5 text-center text-[7px] font-medium ${c === "Monthly" ? "border-blue-500 bg-blue-500 text-white" : "border-blue-200 text-blue-500"}`}>{c}</div>
                ))}
              </div>
              <div className="rounded-lg bg-white border border-blue-200 px-2.5 py-1.5">
                <p className="text-[8px] text-slate-500">Next charge</p>
                <p className="text-[9px] font-semibold text-slate-800">1 Jul 2026 · SGD 49.00</p>
              </div>
            </div>
          ),
        },
        {
          icon: Users,
          iconColor: "text-purple-600",
          iconBg: "bg-purple-50",
          title: "Manage plans & subscribers",
          subtitle: "View and control all subscriptions in one place.",
          illustration: (
            <div className="bg-purple-50 px-3 py-3 space-y-1">
              {[
                { name: "Alice T.", plan: "Pro", status: "Active" },
                { name: "Bob K.", plan: "Basic", status: "Active" },
                { name: "Carol M.", plan: "Pro", status: "Paused" },
              ].map(({ name, plan, status }) => (
                <div key={name} className="flex items-center justify-between">
                  <span className="text-[8px] text-slate-700">{name}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[7px] text-slate-400">{plan}</span>
                    <span className={`rounded-full px-1 py-0.5 text-[6px] font-semibold ${status === "Active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>{status}</span>
                  </div>
                </div>
              ))}
            </div>
          ),
        },
      ]}
    />
  );
}
