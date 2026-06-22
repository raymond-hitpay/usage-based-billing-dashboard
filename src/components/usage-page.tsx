"use client";

import * as React from "react";
import { Banknote, BookOpen, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Landmark, MessageSquare, RefreshCw, Shield, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/* ── Types & data ── */

interface Tier {
  name: string;
  min: number;
  max: number | null; // null = unlimited (last tier)
  priceLabel: string;
}

interface UsageFeature {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  priceLabel: string;
  currentUsage: number;
  unitLabel: string;
  pricingUnit: string; // singular unit name used in pricing display, e.g. "transaction", "send"
  cycleStart: string; // e.g. "Jun 1, 2026"
  cycleEnd: string;   // e.g. "Jun 30, 2026"
  tiers: Tier[];
}

/* ── Billing cycles ── */

interface BillingCycle {
  label: string;
  start: string;
  end: string;
  cashUsage: number;
  smsUsage: number;
}

const BILLING_CYCLES: BillingCycle[] = [
  { label: "Jun 2026", start: "Jun 1, 2026", end: "Jun 30, 2026", cashUsage: 1_240, smsUsage: 328 },
  { label: "May 2026", start: "May 1, 2026", end: "May 31, 2026", cashUsage: 980, smsUsage: 210 },
  { label: "Apr 2026", start: "Apr 1, 2026", end: "Apr 30, 2026", cashUsage: 420, smsUsage: 95 },
  { label: "Mar 2026", start: "Mar 1, 2026", end: "Mar 31, 2026", cashUsage: 0, smsUsage: 0 },
  { label: "Feb 2026", start: "Feb 1, 2026", end: "Feb 28, 2026", cashUsage: 8_200, smsUsage: 3_100 },
  { label: "Jan 2026", start: "Jan 1, 2026", end: "Jan 31, 2026", cashUsage: 140, smsUsage: 62 },
];

const CASH_TIERS: Tier[] = [
  { name: "Tier 1", min: 1, max: 50, priceLabel: "Free" },
  { name: "Tier 2", min: 51, max: 500, priceLabel: "S$0.05/unit" },
  { name: "Tier 3", min: 501, max: 2_000, priceLabel: "S$0.03/unit" },
  { name: "Tier 4", min: 2_001, max: 5_000, priceLabel: "S$0.01/unit" },
  { name: "Tier 5", min: 5_001, max: null, priceLabel: "S$0.005/unit" },
];

const SMS_TIERS: Tier[] = [
  { name: "Tier 1", min: 1, max: 50, priceLabel: "Free" },
  { name: "Tier 2", min: 51, max: 500, priceLabel: "S$0.05/unit" },
  { name: "Tier 3", min: 501, max: 2_000, priceLabel: "S$0.03/unit" },
  { name: "Tier 4", min: 2_001, max: 5_000, priceLabel: "S$0.01/unit" },
  { name: "Tier 5", min: 5_001, max: null, priceLabel: "S$0.005/unit" },
];

/* ── Monthly add-on types & data ── */

interface MonthlyAddon {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  priceLabel: string;
  price: string;
  priceUnit: string;
  status: "available" | "coming_soon";
  type: "fixed" | "usage";
  features?: string[];
  categoryLabel?: string;
  categoryDescription?: string;
}

const MONTHLY_ADDONS: MonthlyAddon[] = [
  {
    id: "quickbooks",
    name: "QuickBooks Online",
    icon: BookOpen,
    description: "Sync your HitPay sales data to QuickBooks automatically.",
    priceLabel: "$9.00 · per month / account",
    price: "$9",
    priceUnit: "per month per account",
    status: "available",
    type: "fixed",
    categoryLabel: "Accounting Integrations",
    categoryDescription:
      "Connect your accounting software for unlimited, automatic syncs. One flat monthly fee per connected account, regardless of sync frequency or volume.",
    features: [
      "Unlimited syncs per month",
      "Auto-sync schedule",
      "Transaction matching",
    ],
  },
  {
    id: "egiro",
    name: "eGiro (DBS Direct Debit)",
    icon: Landmark,
    description:
      "Monthly setup fee plus per-authorization charges beyond your included limit.",
    priceLabel: "$15.00 · per month + usage",
    price: "$15",
    priceUnit: "per month + usage",
    status: "coming_soon",
    type: "fixed",
  },
];

const USAGE_FEATURE_TEMPLATES = [
  {
    name: "Cash transactions",
    icon: Banknote,
    description: "Per-transaction charges for cash payments processed through HitPay.",
    priceLabel: "from $0.01 · per transaction",
    unitLabel: "transactions",
    pricingUnit: "transaction",
    tiers: CASH_TIERS,
    cycleUsageKey: "cashUsage" as const,
  },
  {
    name: "SMS receipts",
    icon: MessageSquare,
    description: "Send receipts via SMS to your customers.",
    priceLabel: "from $0.025 · per SMS",
    unitLabel: "receipts",
    pricingUnit: "send",
    tiers: SMS_TIERS,
    cycleUsageKey: "smsUsage" as const,
  },
];

const TIER_COLORS = [
  "bg-emerald-400",
  "bg-blue-400",
  "bg-violet-400",
  "bg-amber-400",
  "bg-slate-400",
];

const TIER_BORDER_COLORS = [
  "#34d399", // emerald-400
  "#60a5fa", // blue-400
  "#a78bfa", // violet-400
  "#fbbf24", // amber-400
  "#94a3b8", // slate-400
];

const TIER_COLORS_MUTED = [
  "bg-emerald-100",
  "bg-blue-100",
  "bg-violet-100",
  "bg-amber-100",
  "bg-slate-100",
];

function getUsageFeatures(cycle: BillingCycle): UsageFeature[] {
  return USAGE_FEATURE_TEMPLATES.map((t) => ({
    name: t.name,
    icon: t.icon,
    description: t.description,
    priceLabel: t.priceLabel,
    currentUsage: cycle[t.cycleUsageKey],
    unitLabel: t.unitLabel,
    pricingUnit: t.pricingUnit,
    cycleStart: cycle.start,
    cycleEnd: cycle.end,
    tiers: t.tiers,
  }));
}

/* ── Helpers ── */


function getCurrentTier(usage: number, tiers: Tier[]): Tier {
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (usage >= tiers[i].min) return tiers[i];
  }
  return tiers[0];
}

type PricingModel = "volume" | "graduated";

const RATES: Record<string, number> = {
  Free: 0,
  "S$0.05/unit": 0.05,
  "S$0.03/unit": 0.03,
  "S$0.01/unit": 0.01,
  "S$0.005/unit": 0.005,
};

/** Graduated cost: each unit is charged at the rate of the tier it falls into. */
function computeGraduatedCost(usage: number, tiers: Tier[]): number {
  let cost = 0;
  let remaining = usage;
  for (const tier of tiers) {
    if (remaining <= 0) break;
    const tierSize = tier.max ? tier.max - tier.min + 1 : remaining;
    const units = Math.min(remaining, tierSize);
    cost += units * (RATES[tier.priceLabel] ?? 0);
    remaining -= units;
  }
  return cost;
}

/** Volume cost: all billable units charged at the single tier rate the total falls into. */
function computeVolumeCost(usage: number, tiers: Tier[]): number {
  const currentTier = getCurrentTier(usage, tiers);
  const rate = RATES[currentTier.priceLabel] ?? 0;
  // Subtract free-tier units (tier 1)
  const freeUnits = tiers[0].max ?? 0;
  const billableUnits = Math.max(0, usage - freeUnits);
  return billableUnits * rate;
}

function computeCost(usage: number, tiers: Tier[], model: PricingModel): number {
  return model === "volume"
    ? computeVolumeCost(usage, tiers)
    : computeGraduatedCost(usage, tiers);
}

/** For each tier, how many units were consumed and what fill % that is within the segment. */
function computeGraduatedSegmentFills(usage: number, tiers: Tier[]) {
  let remaining = usage;
  return tiers.map((tier, i) => {
    let capacity: number;
    if (tier.max !== null) {
      capacity = tier.max - tier.min + 1;
    } else {
      const prev = tiers[i - 1];
      const prevprev = i >= 2 ? tiers[i - 2] : null;
      capacity = prev.max! - (prevprev ? prevprev.max! : 0);
    }
    const consumed = Math.min(remaining, capacity);
    const fillPct = (consumed / capacity) * 100;
    remaining -= consumed;
    return { tier, consumed, fillPct };
  });
}

/* ── Tier progress bar ── */

/** Equal-width fill: each tier occupies 1/n of the bar. */
function computeEqualWidthFill(usage: number, tiers: Tier[]): number {
  const segWidth = 100 / tiers.length;
  let fill = 0;
  let remaining = usage;
  for (let i = 0; i < tiers.length; i++) {
    const tier = tiers[i];
    let capacity: number;
    if (tier.max !== null) {
      capacity = tier.max - tier.min + 1;
    } else {
      const prev = tiers[i - 1];
      const prevprev = i >= 2 ? tiers[i - 2] : null;
      capacity = prev.max! - (prevprev ? prevprev.max! : 0);
    }
    if (remaining <= 0) break;
    const used = Math.min(remaining, capacity);
    fill += (used / capacity) * segWidth;
    remaining -= used;
  }
  return Math.min(fill, 100);
}

function TierProgressBar({
  currentUsage,
  tiers,
  pricingModel,
}: {
  currentUsage: number;
  tiers: Tier[];
  pricingModel: PricingModel;
}) {
  const currentTier = getCurrentTier(currentUsage, tiers);
  const currentTierIndex = tiers.findIndex((t) => t.name === currentTier.name);

  if (pricingModel === "graduated") {
    const segments = computeGraduatedSegmentFills(currentUsage, tiers);

    return (
      <div className="w-full">
        {/* Multi-colored bar: each segment shows consumption within that tier */}
        <div className="flex h-2 w-full rounded-full overflow-hidden">
          {segments.map(({ tier, fillPct }, i) => (
            <div key={tier.name} className={cn("flex-1 relative", TIER_COLORS_MUTED[i])}>
              <div
                className={cn("absolute inset-y-0 left-0 transition-all duration-500", TIER_COLORS[i])}
                style={{ width: `${fillPct}%` }}
              />
            </div>
          ))}
        </div>

        {/* Tier label segments */}
        <div className="mt-1.5 flex w-full">
          {segments.map(({ tier, consumed, fillPct }, i) => {
            const isCurrent = tier.name === currentTier.name;
            const isEmpty = consumed === 0;
            const rangeLabel = tier.max
              ? `${tier.min.toLocaleString()}–${tier.max.toLocaleString()}`
              : `${tier.min.toLocaleString()}+`;
            return (
              <div
                key={tier.name}
                className={cn(
                  "flex-1 flex flex-col items-center py-1.5 text-center border-t-2",
                  i > 0 && "border-l border-slate-100",
                  isCurrent ? "bg-slate-50" : "border-t-transparent"
                )}
                style={!isEmpty ? { borderTopColor: TIER_BORDER_COLORS[i] } : undefined}
              >
                <span className={cn("text-[10px] font-semibold leading-tight",
                  isEmpty ? "text-slate-300" : isCurrent ? "text-slate-800" : "text-slate-500"
                )}>
                  {tier.name}
                </span>
                <span className={cn("text-[9px] tabular-nums leading-tight mt-0.5",
                  isEmpty ? "text-slate-200" : isCurrent ? "text-slate-500" : "text-slate-400"
                )}>
                  {rangeLabel} · {tier.priceLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Volume: single-color fill
  const fillPercent = computeEqualWidthFill(currentUsage, tiers);
  const fillColor = TIER_BORDER_COLORS[currentTierIndex] ?? "#60a5fa";
  const segWidth = 100 / tiers.length;

  return (
    <div className="w-full">
      <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 transition-all duration-500"
          style={{ width: `${fillPercent}%`, backgroundColor: fillColor }}
        />
        {tiers.slice(0, -1).map((_, i) => (
          <div
            key={i}
            className="absolute inset-y-0 w-px bg-white/70"
            style={{ left: `${(i + 1) * segWidth}%` }}
          />
        ))}
      </div>
      <div className="mt-1.5 flex w-full">
        {tiers.map((tier, i) => {
          const isCurrent = tier.name === currentTier.name;
          const rangeLabel = tier.max
            ? `${tier.min.toLocaleString()}–${tier.max.toLocaleString()}`
            : `${tier.min.toLocaleString()}+`;
          return (
            <div
              key={tier.name}
              className={cn(
                "flex-1 flex flex-col items-center py-1.5 text-center border-t-2 transition-colors",
                i > 0 && "border-l border-slate-100",
                isCurrent ? "bg-slate-50" : "border-t-transparent"
              )}
              style={isCurrent ? { borderTopColor: fillColor } : undefined}
            >
              <span className={cn("text-[10px] font-semibold leading-tight", isCurrent ? "text-slate-800" : "text-slate-400")}>
                {tier.name}
              </span>
              <span className={cn("text-[9px] tabular-nums leading-tight mt-0.5", isCurrent ? "text-slate-500" : "text-slate-300")}>
                {rangeLabel}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Tier breakdown table ── */

function TierBreakdown({
  tiers,
  currentUsage,
  pricingModel,
}: {
  tiers: Tier[];
  currentUsage: number;
  pricingModel: PricingModel;
}) {
  const currentTier = getCurrentTier(currentUsage, tiers);

  if (pricingModel === "graduated") {
    const segments = computeGraduatedSegmentFills(currentUsage, tiers);
    const tierRows = segments.map(({ tier, consumed }) => ({
      tier,
      consumed,
      cost: consumed * (RATES[tier.priceLabel] ?? 0),
    }));
    const totalCost = tierRows.reduce((sum, r) => sum + r.cost, 0);

    return (
      <div className="mt-4 rounded-lg border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs text-slate-500">
              <th className="px-4 py-2 text-left font-medium">Tier</th>
              <th className="px-4 py-2 text-left font-medium">Range</th>
              <th className="px-4 py-2 text-right font-medium">Rate</th>
              <th className="px-4 py-2 text-right font-medium">Units used</th>
              <th className="px-4 py-2 text-right font-medium">Cost</th>
            </tr>
          </thead>
          <tbody>
            {tierRows.map(({ tier, consumed, cost }, i) => {
              const isCurrent = tier.name === currentTier.name;
              const isEmpty = consumed === 0;
              const rangeLabel = tier.max
                ? `${tier.min.toLocaleString()} – ${tier.max.toLocaleString()}`
                : `${tier.min.toLocaleString()}+`;
              return (
                <tr
                  key={tier.name}
                  className={cn(
                    "border-t border-slate-100",
                    isCurrent && "bg-blue-50/60",
                    isEmpty && "opacity-40"
                  )}
                >
                  <td className="px-4 py-2 text-slate-700">
                    <span className="flex items-center gap-2">
                      <span className={cn("h-2 w-2 rounded-full", isEmpty ? "bg-slate-200" : TIER_COLORS[i])} />
                      {tier.name}
                      {isCurrent && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                          Current
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-2 tabular-nums text-slate-600">{rangeLabel}</td>
                  <td className="px-4 py-2 text-right font-medium tabular-nums text-slate-900">{tier.priceLabel}</td>
                  <td className="px-4 py-2 text-right tabular-nums text-slate-600">
                    {consumed > 0 ? consumed.toLocaleString() : "–"}
                  </td>
                  <td className={cn("px-4 py-2 text-right font-medium tabular-nums", isEmpty ? "text-slate-300" : "text-slate-900")}>
                    {consumed === 0 ? "–" : cost === 0 ? "Free" : `S$${cost.toFixed(2)}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }

  // Volume: simple Tier / Range / Rate table
  return (
    <div className="mt-4 rounded-lg border border-slate-100 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-xs text-slate-500">
            <th className="px-4 py-2 text-left font-medium">Tier</th>
            <th className="px-4 py-2 text-left font-medium">Range</th>
            <th className="px-4 py-2 text-right font-medium">Rate</th>
          </tr>
        </thead>
        <tbody>
          {tiers.map((tier, i) => {
            const isCurrent = tier.name === currentTier.name;
            const rangeLabel = tier.max
              ? `${tier.min.toLocaleString()} – ${tier.max.toLocaleString()}`
              : `${tier.min.toLocaleString()}+`;
            return (
              <tr
                key={tier.name}
                className={cn("border-t border-slate-100", isCurrent && "bg-blue-50/60")}
              >
                <td className="px-4 py-2 text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className={cn("h-2 w-2 rounded-full", TIER_COLORS[i])} />
                    {tier.name}
                    {isCurrent && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                        Current
                      </span>
                    )}
                  </span>
                </td>
                <td className="px-4 py-2 tabular-nums text-slate-600">{rangeLabel}</td>
                <td className="px-4 py-2 text-right font-medium tabular-nums text-slate-900">{tier.priceLabel}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ── Feature card ── */

function UsageFeatureCard({
  feature,
  pricingModel,
  onCancel,
}: {
  feature: UsageFeature;
  pricingModel: PricingModel;
  onCancel?: () => void;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const Icon = feature.icon;
  const currentTier = getCurrentTier(feature.currentUsage, feature.tiers);
  const currentCost = computeCost(feature.currentUsage, feature.tiers, pricingModel);

  const handleCancel = () => {
    const confirmed = window.confirm(
      `Are you sure you want to cancel ${feature.name}? You can reactivate it anytime in Add-ons.`
    );
    if (confirmed && onCancel) {
      onCancel();
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2 justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
            <Icon className="h-4 w-4 text-slate-600" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">
            {feature.name}
          </h3>
        </div>
        {onCancel && (
          <button
            onClick={handleCancel}
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Stats row: usage · current tier · projected cost */}
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400">{feature.unitLabel.charAt(0).toUpperCase() + feature.unitLabel.slice(1)} this cycle</p>
          <p className="text-lg font-semibold tabular-nums text-slate-900">
            {feature.currentUsage.toLocaleString()}
          </p>
        </div>
        {pricingModel === "volume" && (
          <div className="text-center">
            <p className="text-xs text-slate-400">Current tier &amp; pricing</p>
            <p className="text-sm font-semibold text-slate-900">
              {currentTier.priceLabel === "Free"
                ? `${currentTier.name} (Free)`
                : `${currentTier.name} (${currentTier.priceLabel.replace("/unit", `/ ${feature.pricingUnit}`)})`
              }
            </p>
          </div>
        )}
        <div className="text-right">
          <p className="text-xs text-slate-400">Projected cost</p>
          <p className="text-lg font-semibold tabular-nums text-slate-900">
            S${currentCost.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <TierProgressBar
        currentUsage={feature.currentUsage}
        tiers={feature.tiers}
        pricingModel={pricingModel}
      />

      {/* Expand / collapse tier breakdown */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
      >
        {expanded ? "Hide tier breakdown" : "View tier breakdown"}
        {expanded ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )}
      </button>

      {expanded && (
        <TierBreakdown
          tiers={feature.tiers}
          currentUsage={feature.currentUsage}
          pricingModel={pricingModel}
        />
      )}
    </div>
  );
}

/* ── Addon card (unsubscribed) ── */

function AddonCard({
  addon,
  onSubscribe,
}: {
  addon: MonthlyAddon;
  onSubscribe: () => void;
}) {
  const Icon = addon.icon;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 px-5 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <Icon className="h-5 w-5 text-slate-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-slate-900">{addon.name}</h4>
          {addon.status === "coming_soon" && (
            <Badge variant="warning">Coming soon</Badge>
          )}
        </div>
        <p className="mt-0.5 text-sm text-slate-500">{addon.description}</p>
        <p className="mt-0.5 text-sm text-slate-600">{addon.priceLabel}</p>
      </div>
      <div className="shrink-0">
        {addon.status === "available" ? (
          <button
            onClick={onSubscribe}
            className="rounded-lg border border-blue-200 bg-white px-4 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
          >
            Subscribe
          </button>
        ) : (
          <button
            disabled
            className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-400 cursor-not-allowed"
          >
            Coming soon
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Active addon card ── */

function ActiveAddonCard({ addon, onCancel }: { addon: MonthlyAddon; onCancel?: () => void }) {
  const Icon = addon.icon;

  const handleCancel = () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this subscription? You can reactivate it anytime in Add-ons."
    );
    if (confirmed && onCancel) {
      onCancel();
    }
  };

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 px-5 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
        <Icon className="h-5 w-5 text-emerald-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-slate-900">{addon.name}</h4>
          <Badge variant="success">Active</Badge>
        </div>
        <p className="mt-0.5 text-sm text-slate-500">{addon.description}</p>
        <p className="mt-0.5 text-sm text-slate-600">{addon.priceLabel}</p>
      </div>
      <div className="shrink-0 flex items-center gap-3">
        <div className="text-right">
          <p className="text-xs text-slate-400">Projected cost</p>
          <p className="text-lg font-semibold tabular-nums text-slate-900">
            {addon.price}.00
          </p>
        </div>
        <button
          onClick={handleCancel}
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/* ── Subscription confirmation modal ── */

function SubscribeModal({
  addon,
  onClose,
  onConfirm,
}: {
  addon: MonthlyAddon;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const Icon = addon.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors z-10"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-8 pt-8 pb-0">
          {/* Premium badge */}
          <Badge variant="info" className="mb-3">
            <Shield className="h-3 w-3" />
            Premium feature
          </Badge>

          <h2 className="text-2xl font-bold text-slate-900 leading-tight">
            Subscribe to connect
            <br />
            {addon.name} to HitPay
          </h2>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Accounting integrations are a Premium feature. Subscribe to sync
            your HitPay sales data to {addon.name} automatically — with a
            simple flat monthly fee per connected account.
          </p>
        </div>

        {/* Plan details card */}
        <div className="px-8 py-6">
          <div className="rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-slate-900">
                {addon.categoryLabel ?? addon.name}
              </h3>
              <Badge variant="outline">Monthly flat fee</Badge>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              {addon.categoryDescription ?? addon.description}
            </p>

            {addon.features && addon.features.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Includes
                </p>
                <ul className="space-y-1.5">
                  {addon.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-2 text-sm text-slate-700"
                    >
                      <Check className="h-4 w-4 text-blue-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Pricing card */}
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/50 py-6 text-center">
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                <Icon className="h-4 w-4 text-emerald-600" />
                {addon.name}
              </div>
              <p className="text-4xl font-bold text-slate-900">{addon.price}</p>
              <p className="mt-1 text-sm text-slate-500">{addon.priceUnit}</p>

              {addon.features && addon.features.length > 0 && (
                <ul className="mt-4 space-y-1">
                  {addon.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center justify-center gap-2 text-sm text-slate-600"
                    >
                      <Check className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-8 py-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs text-slate-400">Total due monthly</p>
              <p className="text-xl font-bold text-slate-900">
                $9.00{" "}
                <span className="text-sm font-normal text-slate-500">
                  / account
                </span>
              </p>
            </div>
            <button
              onClick={onConfirm}
              className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              Subscribe now
            </button>
          </div>
        </div>

        <p className="px-8 pb-6 text-center text-xs text-slate-400">
          Cancel anytime. Prices in SGD. No setup fees.
        </p>
      </div>
    </div>
  );
}

/* ── Not-subscribed feature card ── */

function UsageFeatureNotSubscribed({
  feature,
  onActivate,
}: {
  feature: UsageFeature;
  onActivate: () => void;
}) {
  const Icon = feature.icon;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 px-5 py-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        <Icon className="h-5 w-5 text-slate-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-slate-900">{feature.name}</h4>
        <p className="mt-0.5 text-sm text-slate-500">{feature.description}</p>
        <p className="mt-0.5 text-sm text-slate-600">{feature.priceLabel}</p>
      </div>
      <div className="shrink-0">
        <button
          onClick={onActivate}
          className="rounded-lg border border-blue-200 bg-white px-4 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
        >
          Subscribe
        </button>
      </div>
    </div>
  );
}

/* ── Main page ── */

export function UsagePage({ pricingModel }: { pricingModel: PricingModel }) {
  const [refreshing, setRefreshing] = React.useState(false);
  const [cycleIndex, setCycleIndex] = React.useState(0); // 0 = most recent
  const [subscriptions, setSubscriptions] = React.useState<Record<string, boolean>>({
    "Cash transactions": true,
    "SMS receipts": false,
  });
  const [addonSubscriptions, setAddonSubscriptions] = React.useState<Record<string, boolean>>({
    quickbooks: true,
    egiro: false,
  });
  const [subscribeModalAddon, setSubscribeModalAddon] = React.useState<MonthlyAddon | null>(null);

  const currentCycle = BILLING_CYCLES[cycleIndex];
  const USAGE_FEATURES = getUsageFeatures(currentCycle);
  const isLatestCycle = cycleIndex === 0;
  const isOldestCycle = cycleIndex === BILLING_CYCLES.length - 1;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleConfirmSubscribe = () => {
    if (subscribeModalAddon) {
      setAddonSubscriptions((prev) => ({
        ...prev,
        [subscribeModalAddon.id]: true,
      }));
      setSubscribeModalAddon(null);
    }
  };

  const activeAddons = MONTHLY_ADDONS.filter(
    (a) => addonSubscriptions[a.id]
  );
  const availableAddons = MONTHLY_ADDONS.filter(
    (a) => !addonSubscriptions[a.id]
  );

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-b px-8 py-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Usage</h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Track your real-time usage and see your rate improve as you grow.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
            {isLatestCycle && <span>Last updated: less than a minute ago</span>}
            {isLatestCycle && (
              <button
                onClick={handleRefresh}
                className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors"
                aria-label="Refresh"
              >
                <RefreshCw
                  className={cn(
                    "h-3.5 w-3.5",
                    refreshing && "animate-spin"
                  )}
                />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6 overflow-y-auto px-8 py-6">
        {/* Billing cycle selector */}
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
          <span className="font-medium text-slate-700">Billing cycle:</span>
          <button
            onClick={() => setCycleIndex((i) => i + 1)}
            disabled={isOldestCycle}
            className="flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Previous billing cycle"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>
          <span className="tabular-nums">{currentCycle.start} – {currentCycle.end}</span>
          <button
            onClick={() => setCycleIndex((i) => i - 1)}
            disabled={isLatestCycle}
            className="flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Next billing cycle"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
          {isLatestCycle && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
              Current
            </span>
          )}
        </div>

        {/* ── Active Plans ── */}
        {/* Show activated usage-based features + activated fixed add-ons */}
        {(USAGE_FEATURES.some((f) => subscriptions[f.name] !== false) ||
          activeAddons.length > 0) && (
          <div>
            <h2 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
              Active Plans
            </h2>
            <div className="space-y-4">
              {USAGE_FEATURES.filter((f) => subscriptions[f.name] !== false).map(
                (feature) => (
                  <UsageFeatureCard
                    key={feature.name}
                    feature={feature}
                    pricingModel={pricingModel}
                    onCancel={() =>
                      setSubscriptions((prev) => ({
                        ...prev,
                        [feature.name]: false,
                      }))
                    }
                  />
                )
              )}
              {activeAddons.map((addon) => (
                <ActiveAddonCard
                  key={addon.id}
                  addon={addon}
                  onCancel={() =>
                    setAddonSubscriptions((prev) => ({
                      ...prev,
                      [addon.id]: false,
                    }))
                  }
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Add-ons ── */}
        <div>
          <h2 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            Add-ons
          </h2>

          {/* Usage Based Pricing sub-group */}
          {USAGE_FEATURES.some((f) => subscriptions[f.name] === false) && (
            <div className="mt-3">
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                Usage Based Pricing
              </h3>
              <div className="space-y-3">
                {USAGE_FEATURES.filter(
                  (f) => subscriptions[f.name] === false
                ).map((feature) => (
                  <UsageFeatureNotSubscribed
                    key={feature.name}
                    feature={feature}
                    onActivate={() =>
                      setSubscriptions((prev) => ({
                        ...prev,
                        [feature.name]: true,
                      }))
                    }
                  />
                ))}
              </div>
            </div>
          )}

          {/* Fixed Pricing sub-group */}
          {availableAddons.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                Fixed Pricing
              </h3>
              <div className="space-y-3">
                {availableAddons.map((addon) => (
                  <AddonCard
                    key={addon.id}
                    addon={addon}
                    onSubscribe={() => setSubscribeModalAddon(addon)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subscription modal */}
      {subscribeModalAddon && (
        <SubscribeModal
          addon={subscribeModalAddon}
          onClose={() => setSubscribeModalAddon(null)}
          onConfirm={handleConfirmSubscribe}
        />
      )}
    </div>
  );
}
