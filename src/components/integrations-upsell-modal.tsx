"use client";

import * as React from "react";
import { X, Lock } from "lucide-react";

interface IntegrationsUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  integrationName?: string;
}

export function IntegrationsUpsellModal({
  isOpen,
  onClose,
  onSubscribe,
  integrationName = "Integration",
}: IntegrationsUpsellModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-sm rounded-lg bg-white shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Premium Feature</h2>
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
          {/* Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-amber-100 p-4">
              <Lock className="h-8 w-8 text-amber-600" />
            </div>
          </div>

          {/* Message */}
          <div className="text-center space-y-2">
            <p className="text-sm font-semibold text-slate-900">
              {integrationName} is a Premium Feature
            </p>
            <p className="text-sm text-slate-600">
              Unlock advanced integrations with your accounting software, CRM, and business tools.
            </p>
          </div>

          {/* Features list */}
          <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-2">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Premium includes:</p>
            {[
              "Connect accounting software (Xero, QuickBooks, etc.)",
              "Real-time transaction sync",
              "Automated reconciliation",
              "Custom field mapping",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-2.5">
                <div className="h-4 w-4 rounded-full bg-blue-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* Info */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
            <p className="text-xs text-blue-700">
              Upgrade to unlock this integration and sync your data automatically.
            </p>
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
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  );
}
