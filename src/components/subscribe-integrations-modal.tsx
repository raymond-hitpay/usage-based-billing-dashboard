"use client";

import * as React from "react";
import { X, Check } from "lucide-react";

interface SubscribeIntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  integration: {
    id: string;
    name: string;
    category: string;
    price?: number;
    features?: string[];
    backgroundColor?: string;
    textColor?: string;
    integrationIcon?: string;
  } | null;
}

const INTEGRATION_DATA: Record<
  string,
  {
    price: number;
    features: string[];
    backgroundColor: string;
    textColor: string;
    integrationIcon: string;
  }
> = {
  xero: {
    price: 10,
    features: ["Unlimited syncs", "Auto-sync schedule", "Transaction matching"],
    backgroundColor: "bg-blue-500",
    textColor: "text-white",
    integrationIcon: "X",
  },
  "xero-bill": {
    price: 10,
    features: ["Unlimited syncs", "Auto-sync schedule", "Transaction matching"],
    backgroundColor: "bg-blue-500",
    textColor: "text-white",
    integrationIcon: "X",
  },
  quickbooks: {
    price: 10,
    features: ["Unlimited syncs", "Auto-sync schedule", "Transaction matching"],
    backgroundColor: "bg-green-600",
    textColor: "text-white",
    integrationIcon: "QB",
  },
  zoho: {
    price: 10,
    features: ["Unlimited syncs", "Auto-sync schedule", "Multi-currency"],
    backgroundColor: "bg-purple-600",
    textColor: "text-white",
    integrationIcon: "Z",
  },
  netsuite: {
    price: 10,
    features: ["Real-time sync", "Transaction matching", "Custom fields"],
    backgroundColor: "bg-orange-600",
    textColor: "text-white",
    integrationIcon: "N",
  },
};

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  Accounting:
    "Connect your accounting software for unlimited, automatic syncs. One flat monthly fee per connected account, regardless of sync frequency or volume.",
};

const CATEGORY_INCLUDES: Record<string, string[]> = {
  Accounting: [
    "Real-time transaction sync",
    "Automated reconciliation",
    "Custom field mapping",
  ],
};

export function SubscribeIntegrationsModal({
  isOpen,
  onClose,
  integration,
}: SubscribeIntegrationsModalProps) {
  if (!isOpen || !integration) return null;

  // Get integration data, either from passed props or from INTEGRATION_DATA
  const integrationData =
    integration.price && integration.features && integration.backgroundColor
      ? integration
      : INTEGRATION_DATA[integration.id];

  const price = integrationData?.price || integration.price || 0;
  const features = integrationData?.features || integration.features || [];
  const backgroundColor =
    integrationData?.backgroundColor || integration.backgroundColor || "bg-blue-500";
  const textColor =
    integrationData?.textColor || integration.textColor || "text-white";
  const integrationIcon =
    integrationData?.integrationIcon || integration.integrationIcon || "X";

  const categoryDescription =
    CATEGORY_DESCRIPTIONS[integration.category] ||
    "Connect your business tools and automate your workflows.";
  const categoryIncludes =
    CATEGORY_INCLUDES[integration.category] ||
    ["Unlimited syncs", "Real-time data synchronization", "Custom field mapping"];

  const handleSubscribeClick = () => {
    window.location.href = "https://hitpay-billing-sandbox.fly.dev/recurring-billing/cherry-4/hitpay-subscription";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-lg my-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-8 py-6">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 mb-2">
              Premium feature
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              Subscribe to connect {integration.name} to HitPay
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-8 space-y-8">
          {/* Main card with category info */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {integration.category} Integrations
            </h3>
            <p className="text-sm font-semibold text-slate-700">Monthly flat fee</p>
            <p className="text-sm text-slate-600">{categoryDescription}</p>

            {/* Includes section */}
            <div className="pt-4 space-y-3">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                INCLUDES
              </p>
              <div className="space-y-2">
                {categoryIncludes.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 shrink-0" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Integration showcase */}
          <div className="flex items-center justify-center gap-8 rounded-lg border border-slate-200 bg-slate-50 p-8">
            {/* Integration icon */}
            <div className="flex flex-col items-center gap-3">
              <div
                className={`w-20 h-20 rounded-full ${backgroundColor} ${textColor} flex items-center justify-center font-bold text-2xl`}
              >
                {integrationIcon}
              </div>
              <p className="font-semibold text-slate-900 text-center">
                {integration.name.toUpperCase()}
              </p>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div>
                <p className="text-4xl font-bold text-slate-900">
                  ${price}
                </p>
                <p className="text-sm text-slate-600">per month per account</p>
              </div>

              {/* Features */}
              <div className="space-y-2">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600 shrink-0" />
                    <span className="text-sm text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Total due monthly */}
          <div className="flex items-center justify-between p-6 rounded-lg bg-blue-50 border border-blue-200">
            <div>
              <p className="text-sm text-blue-600 font-semibold">Total due monthly</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">
                ${price.toFixed(2)} <span className="text-lg">/ account</span>
              </p>
            </div>
            <button
              onClick={handleSubscribeClick}
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              Subscribe Now
            </button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-600">
            Cancel anytime. First month 50% off. Prices in SGD.
          </p>
        </div>
      </div>
    </div>
  );
}
