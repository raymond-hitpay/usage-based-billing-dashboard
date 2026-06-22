"use client";

import * as React from "react";
import { useState } from "react";
import { X, Check } from "lucide-react";

interface SubscribeCashModalProps {
  isOpen: boolean;
  onClose: () => void;
  isActive?: boolean;
}

// Pricing tiers for cash transactions
const PRICING_TIERS = [
  { min: 0, max: 50, rate: 0.1 },
  { min: 51, max: 500, rate: 0.0222 },
  { min: 501, max: 5000, rate: 0.0011 },
  { min: 5001, max: Infinity, rate: 0.006 },
];

const FREE_TRANSACTIONS = 10;

function calculateEstimatedCost(volume: number): number {
  if (volume <= FREE_TRANSACTIONS) {
    return 0;
  }

  let billableVolume = volume - FREE_TRANSACTIONS;
  let cost = 0;

  // Find which tier(s) the billable volume falls into
  for (const tier of PRICING_TIERS) {
    if (billableVolume <= 0) break;

    const tierMin = tier.min === 0 ? FREE_TRANSACTIONS : tier.min;
    const tierMax = tier.max;

    // Calculate how many transactions fall in this tier
    const volumeInTier = Math.min(billableVolume, tierMax - tierMin + 1);
    cost += volumeInTier * tier.rate;
    billableVolume -= volumeInTier;
  }

  return cost;
}

export function SubscribeCashModal({
  isOpen,
  onClose,
  isActive = false,
}: SubscribeCashModalProps) {
  const [volume, setVolume] = useState(10);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const estimatedCost = calculateEstimatedCost(volume);

  if (!isOpen) return null;

  const handleCancelClick = () => {
    setShowCancelConfirmation(true);
  };

  const handleConfirmCancel = () => {
    console.log("Cash subscription cancelled");
    setShowCancelConfirmation(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors z-10"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Section */}
        <div className="px-8 pt-8 pb-6">
          {isActive ? (
            <>
              <div className="inline-block bg-green-100 text-green-700 text-xs font-bold uppercase rounded px-3 py-1 mb-4">
                Active subscription
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-3">
                Cash Transactions Subscription
              </h1>
              <p className="text-base text-slate-600">
                You have an active cash transactions subscription. You can record cash payments on invoices with volume-based pricing.
              </p>
            </>
          ) : (
            <>
              <div className="inline-block bg-blue-100 text-blue-700 text-xs font-bold uppercase rounded px-3 py-1 mb-4">
                Premium feature
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-3">
                Upgrade to record cash payments and grow without limits
              </h1>
              <p className="text-base text-slate-600">
                Recording cash payments on invoices is a Premium feature. Upgrade your plan to unlock cash transactions, volume-based pricing, and advanced invoicing tools.
              </p>
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="px-8 pb-8">
          {/* Pricing Card */}
          <div className="mb-8 rounded-lg border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase mb-1">
                  Cash Transactions
                </p>
                <p className="text-base text-slate-500 mb-4">
                  Pay-per-transaction
                </p>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-slate-900">
                    ${estimatedCost.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  {volume} transactions
                </p>
                <p className="text-sm text-slate-600">
                  POS and Invoice cash transactions. Volume-based pricing: start at $0.10/txn for light users, decreasing rates as you grow. Plus 10 free transactions per month.
                </p>
              </div>

              {/* Pricing Tiers */}
              <div>
                <p className="text-sm font-semibold text-slate-900 mb-4">
                  Pricing Tiers
                </p>
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="text-sm text-slate-700">
                      0-50 txns: $0.10/txn
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="text-sm text-slate-700">
                      51-500 txns: $0.0222/txn
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="text-sm text-slate-700">
                      501-5,000 txns: $0.0011/txn
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="text-sm text-slate-700">
                      5,001+ txns: $0.0060/txn
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="h-4 w-4 text-blue-600 shrink-0" />
                    <span className="text-sm text-slate-700">
                      10 free txns/month included
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Volume Slider Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                Volume Slider
              </p>
              <p className="text-lg font-bold text-blue-600">
                {volume} transactions
              </p>
            </div>
            <div className="space-y-4">
              <input
                type="range"
                min="10"
                max="5000"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                style={{
                  background: `linear-gradient(to right, rgb(37, 99, 235) 0%, rgb(37, 99, 235) ${((volume - 10) / (5000 - 10)) * 100}%, rgb(226, 232, 240) ${((volume - 10) / (5000 - 10)) * 100}%, rgb(226, 232, 240) 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>10 txns</span>
                <span>5,000+ txns</span>
              </div>
            </div>
          </div>

          {/* Estimated Monthly Cost */}
          <div className="mb-8 rounded-lg bg-slate-50 border border-slate-200 p-6">
            <p className="text-sm text-slate-600 mb-2">
              Estimated monthly cost
            </p>
            <p className="text-2xl font-bold text-slate-900">
              ${estimatedCost.toFixed(2)} / {volume} transactions
            </p>
          </div>

          {/* Footer Text */}
          <div className="mb-6 text-center text-xs text-slate-500">
            Cancel anytime. Prices in SGD. No setup fees.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 border-t border-slate-200 px-8 py-4 bg-slate-50">
          {isActive ? (
            <>
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleCancelClick}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors shadow-sm"
              >
                Cancel Plan
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  window.location.href = "https://hitpay-billing-sandbox.fly.dev/recurring-billing/cherry-4/hitpay-subscription";
                }}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
              >
                Subscribe now
              </button>
            </>
          )}
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelConfirmation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-sm rounded-lg bg-white shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Cancel Subscription?
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to cancel your cash transactions subscription? You will no longer be able to record cash payments on invoices.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirmation(false)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Keep Plan
              </button>
              <button
                onClick={handleConfirmCancel}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Cancel Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
