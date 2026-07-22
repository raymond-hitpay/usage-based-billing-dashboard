"use client";

import * as React from "react";
import { useState } from "react";
import { X, Check } from "lucide-react";
import { CardPaymentModal } from "@/components/card-payment-modal";

interface Tier {
  name: string;
  min: number;
  max: number | null;
  priceLabel: string;
}

interface UsageFeature {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  enabledDescription: string;
  priceLabel: string;
  currentUsage: number;
  unitLabel: string;
  pricingUnit: string;
  tiers: Tier[];
}

interface SubscribeCashModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe?: () => void;
  isActive?: boolean;
  feature?: UsageFeature;
}

// Pricing tiers for different features
const PRICING_TIERS_MAP: Record<string, Array<{ min: number; max: number; rate: number; label: string }>> = {
  "Manual Payments": [
    { min: 1,    max: 10,       rate: 0,     label: "1–10 txns: Free" },
    { min: 11,   max: 50,       rate: 0.10,  label: "11–50 txns: SGD 0.10/txn" },
    { min: 51,   max: 500,      rate: 0.02,  label: "51–500 txns: SGD 0.02/txn" },
    { min: 501,  max: 5000,     rate: 0.01,  label: "501–5,000 txns: SGD 0.01/txn" },
    { min: 5001, max: Infinity, rate: 0.005, label: "5,001+ txns: SGD 0.005/txn" },
  ],
  "SMS Receipts": [
    { min: 1,    max: 5,        rate: 0,     label: "1–5 SMS: Free" },
    { min: 6,    max: 500,      rate: 0.025, label: "6–500 SMS: SGD 0.025/SMS" },
    { min: 501,  max: 5000,     rate: 0.02,  label: "501–5,000 SMS: SGD 0.02/SMS" },
    { min: 5001, max: Infinity, rate: 0.01,  label: "5,001+ SMS: SGD 0.01/SMS" },
  ],
  "eGiro (DBS Direct Debit)": [
    { min: 1,    max: 100,      rate: 0,     label: "1–100 auths: Free" },
    { min: 101,  max: Infinity, rate: 0.10,  label: "101+ auths: SGD 0.10/auth" },
  ],
};

const FLAT_FEES_MAP: Record<string, number> = {
  "Manual Payments": 0,
  "SMS Receipts": 0,
  "eGiro (DBS Direct Debit)": 15.00,
};

function calculateEstimatedCost(volume: number, featureName: string): number {
  const tiers = PRICING_TIERS_MAP[featureName] || PRICING_TIERS_MAP["Manual Payments"];
  let cost = 0;
  let remaining = volume;
  for (const tier of tiers) {
    if (remaining <= 0) break;
    const capacity = tier.max === Infinity ? remaining : tier.max - tier.min + 1;
    const used = Math.min(remaining, capacity);
    cost += used * tier.rate;
    remaining -= used;
  }
  const flatFee = FLAT_FEES_MAP[featureName] || 0;
  return cost + flatFee;
}

export function SubscribeCashModal({
  isOpen,
  onClose,
  onSubscribe,
  isActive = false,
  feature,
}: SubscribeCashModalProps) {
  const [volume, setVolume] = useState(1);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showCardPayment, setShowCardPayment] = useState(false);

  // Use provided feature or default to Manual Payments for backward compatibility
  const displayFeature = feature || {
    name: "Manual Payments",
    icon: () => null,
    description: "Record cash, bank transfer, and offline payments on POS and invoices.",
    enabledDescription: "Record cash, bank transfer, and offline payments on POS and invoices.",
    priceLabel: "from SGD 0.005 · per transaction",
    currentUsage: 0,
    unitLabel: "transactions",
    pricingUnit: "transaction",
    tiers: [],
  };

  const estimatedCost = calculateEstimatedCost(volume, displayFeature.name);
  const pricingTiers = PRICING_TIERS_MAP[displayFeature.name] || PRICING_TIERS_MAP["Manual Payments"];
  const flatFee = FLAT_FEES_MAP[displayFeature.name] || 0;
  const maxVolume = displayFeature.name === "eGiro (DBS Direct Debit)" ? 500 : 5001;

  if (!isOpen) return null;

  const sliderPct = ((volume - 1) / (maxVolume - 1)) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg flex flex-col max-h-[90vh] rounded-xl bg-white shadow-xl">

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 pt-6 pb-4">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Badge + heading */}
          <div className={`inline-block text-xs font-bold uppercase rounded px-2.5 py-1 mb-3 ${isActive ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
            {isActive ? "Active subscription" : "Premium feature"}
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">
            {isActive ? displayFeature.name : `Subscribe to ${displayFeature.name}`}
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            {displayFeature.description}
          </p>

          {/* Pricing tiers — compact list */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 mb-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2.5">
              {flatFee > 0 ? "Base fee + Pricing tiers" : "Pricing tiers"}
            </p>
            <div className="space-y-1.5">
              {flatFee > 0 && (
                <div className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  <span className="text-sm text-slate-700">Monthly base fee: SGD {flatFee.toFixed(2)}</span>
                </div>
              )}
              {pricingTiers.map((tier) => (
                <div key={tier.label} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                  <span className="text-sm text-slate-700">{tier.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Volume slider */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Estimate your cost</p>
              <p className="text-sm font-bold text-blue-600">{volume.toLocaleString()} {displayFeature.pricingUnit}{volume !== 1 ? "s" : ""}</p>
            </div>
            <input
              type="range"
              min="1"
              max={maxVolume}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgb(37,99,235) ${sliderPct}%, rgb(226,232,240) ${sliderPct}%)`,
              }}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1 {displayFeature.pricingUnit}</span>
              <span>{maxVolume}+ {displayFeature.pricingUnit}s</span>
            </div>
          </div>

          {/* Estimated cost */}
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 flex items-center justify-between">
            <p className="text-sm text-slate-500">Estimated monthly cost</p>
            <p className="text-lg font-bold text-slate-900">SGD {estimatedCost.toFixed(2)}</p>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="border-t border-slate-200 px-6 py-4 bg-white rounded-b-xl">
          {isActive ? (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => setShowCancelConfirmation(true)}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Cancel Plan
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-3 mb-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowCardPayment(true);
                  }}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Subscribe now
                </button>
              </div>
              <p className="text-center text-xs text-slate-400 mb-1">
                Cancel anytime · Prices in SGD · No setup fees
              </p>
              <p className="text-center">
                <button
                  onClick={() => onSubscribe?.()}
                  className="text-xs text-slate-400 underline hover:text-slate-600 transition-colors"
                >
                  Mock subscribe (skip checkout)
                </button>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Cancel confirmation */}
      {showCancelConfirmation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-xl p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Cancel Subscription?</h2>
            <p className="text-sm text-slate-500 mb-5">
              You will no longer be able to use {displayFeature.name.toLowerCase()}.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirmation(false)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Keep Plan
              </button>
              <button
                onClick={() => { setShowCancelConfirmation(false); onClose(); }}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Cancel Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card payment modal */}
      <CardPaymentModal
        isOpen={showCardPayment}
        onClose={() => {
          setShowCardPayment(false);
        }}
        featureName={displayFeature.name}
        amount={estimatedCost}
        onSuccess={() => {
          onSubscribe?.();
          setShowCardPayment(false);
          onClose();
        }}
      />
    </div>
  );
}
