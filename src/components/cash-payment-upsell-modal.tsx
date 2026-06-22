"use client";

import * as React from "react";
import { X, AlertCircle } from "lucide-react";

interface CashPaymentUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  usedFreePayments?: number;
  freeLimit?: number;
}

export function CashPaymentUpsellModal({
  isOpen,
  onClose,
  onSubscribe,
  usedFreePayments = 10,
  freeLimit = 10,
}: CashPaymentUpsellModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-sm rounded-lg bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Add cash payment</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">
          {/* User info - Grayed out */}
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 opacity-50">
            <p className="text-sm text-slate-600 mb-2">Uploading as</p>
            <p className="text-sm font-semibold text-slate-900">Alex Turner</p>
            <p className="text-xs text-slate-500 mt-0.5">alex@company.io</p>
          </div>

          {/* Pricing info - Grayed out */}
          <div className="space-y-2 opacity-50">
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Amount</span>
              <span className="text-sm font-semibold text-slate-900">SGD 300.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-600">Payment date</span>
              <span className="text-sm font-semibold text-slate-900">DD/MM/YY</span>
            </div>
          </div>

          {/* Warning message - Prominent yellow box */}
          <div className="rounded-lg bg-yellow-50 p-4 border-2 border-yellow-300">
            <p className="text-sm font-semibold text-yellow-900">
              You've used all 10 free cash payments
            </p>
            <p className="text-sm text-yellow-800 mt-2">
              Upgrade to your plan to continue accepting cash payments.
            </p>
            <div className="rounded-lg bg-yellow-100 p-3 mt-3 border border-yellow-200">
              <p className="text-xs text-yellow-900 font-medium">
                You can upgrade the plan if you want to use this feature
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-slate-200 px-6 py-4">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSubscribe}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            Upgrade
          </button>
        </div>
      </div>
    </div>
  );
}
