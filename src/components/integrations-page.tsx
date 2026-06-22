"use client";

import * as React from "react";
import {
  Grid3x3,
  CreditCard,
  Zap,
  DollarSign,
  Heart,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { IntegrationsUpsellModal } from "./integrations-upsell-modal";
import { SubscribeIntegrationsModal } from "./subscribe-integrations-modal";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  connected: boolean;
  price?: number;
  features?: string[];
  backgroundColor?: string;
  textColor?: string;
  integrationIcon?: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: "xero",
    name: "Xero",
    description: "Sync transactions to your Xero account",
    category: "Accounting",
    price: 10,
    features: ["Unlimited syncs", "Auto-sync schedule", "Transaction matching"],
    backgroundColor: "bg-blue-500",
    textColor: "text-white",
    integrationIcon: "X",
    icon: () => (
      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
        X
      </div>
    ),
    connected: false,
  },
  {
    id: "xero-bill",
    name: "Xero (Bill Pay)",
    description: "Sync vendors, bills and payments to Xero",
    category: "Accounting",
    price: 10,
    features: ["Unlimited syncs", "Auto-sync schedule", "Transaction matching"],
    backgroundColor: "bg-blue-500",
    textColor: "text-white",
    integrationIcon: "X",
    icon: () => (
      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
        X
      </div>
    ),
    connected: true,
  },
  {
    id: "quickbooks",
    name: "QuickBooks Online",
    description: "Sync sales data to QuickBooks automatically",
    category: "Accounting",
    price: 10,
    features: ["Unlimited syncs", "Auto-sync schedule", "Transaction matching"],
    backgroundColor: "bg-green-600",
    textColor: "text-white",
    integrationIcon: "QB",
    icon: () => (
      <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-lg">
        QB
      </div>
    ),
    connected: false,
  },
  {
    id: "zoho",
    name: "Zoho Books",
    description: "Sync sales data to Zoho Books automatically",
    category: "Accounting",
    price: 10,
    features: ["Unlimited syncs", "Auto-sync schedule", "Multi-currency"],
    backgroundColor: "bg-purple-600",
    textColor: "text-white",
    integrationIcon: "Z",
    icon: () => (
      <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
        Z
      </div>
    ),
    connected: false,
  },
  {
    id: "netsuite",
    name: "NetSuite",
    description: "Sync transactions to your NetSuite account",
    category: "Accounting",
    price: 10,
    features: ["Real-time sync", "Transaction matching", "Custom fields"],
    backgroundColor: "bg-orange-600",
    textColor: "text-white",
    integrationIcon: "N",
    icon: () => (
      <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold">
        N
      </div>
    ),
    connected: false,
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Connect to 5000+ apps via Zapier",
    category: "HitPay Tools",
    icon: Zap,
    connected: false,
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Accept payments via Stripe",
    category: "Payments",
    icon: CreditCard,
    connected: false,
  },
];

const CATEGORIES = [
  "All Integrations",
  "Payments",
  "HitPay Tools",
  "Accounting",
  "Loyalty",
  "Booking",
  "Messaging",
];

type TabType = "Active" | "Available";

export function IntegrationsPage() {
  const [activeTab, setActiveTab] = React.useState<TabType>("Available");
  const [selectedCategory, setSelectedCategory] = React.useState("All Integrations");
  const [showUpsellModal, setShowUpsellModal] = React.useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = React.useState(false);
  const [selectedIntegration, setSelectedIntegration] = React.useState<Integration | null>(null);
  const [cancelledIntegrations, setCancelledIntegrations] = React.useState<Set<string>>(new Set());

  const handleConnectClick = (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowUpsellModal(true);
  };

  const handleSubscribeClick = () => {
    setShowUpsellModal(false);
    setShowSubscribeModal(true);
  };

  const handleCancelSubscription = (integrationId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this subscription? This action cannot be undone."
    );
    if (confirmed) {
      setCancelledIntegrations(prev => new Set(prev).add(integrationId));
      console.log(`Subscription for ${integrationId} cancelled`);
    }
  };

  const filteredIntegrations = INTEGRATIONS.filter((integration) => {
    const matchesTab =
      activeTab === "Active" ? integration.connected : !integration.connected;
    const matchesCategory =
      selectedCategory === "All Integrations" ||
      integration.category === selectedCategory;
    return matchesTab && matchesCategory;
  });

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-b border-slate-100 px-8 py-6">
        <h1 className="text-2xl font-bold text-slate-900">Integrations</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-100 px-8 py-4 flex gap-8">
        {(["Active", "Available"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-sm font-semibold pb-3 border-b-2 transition-colors ${
              activeTab === tab
                ? "text-slate-900 border-blue-600"
                : "text-slate-600 border-transparent hover:text-slate-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 border-r border-slate-100 overflow-y-auto">
          <div className="p-4 space-y-1">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-8">
          {filteredIntegrations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-slate-600">No integrations available in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIntegrations.map((integration) => (
                <div
                  key={integration.id}
                  className="rounded-lg border border-slate-200 bg-white p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <integration.icon className="h-12 w-12" />
                      <div>
                        <h3 className="font-semibold text-slate-900">
                          {integration.name}
                        </h3>
                        {integration.connected && (
                          <span className="text-xs text-green-600 font-semibold">
                            Connected ✓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">
                    {integration.description}
                  </p>
                  <button
                    onClick={() =>
                      integration.connected
                        ? handleCancelSubscription(integration.id)
                        : handleConnectClick(integration)
                    }
                    className={`w-full rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                      integration.connected
                        ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {integration.connected ? "Cancel Subscription" : "Connect"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <IntegrationsUpsellModal
        isOpen={showUpsellModal}
        onClose={() => setShowUpsellModal(false)}
        onSubscribe={handleSubscribeClick}
        integrationName={selectedIntegration?.name}
      />

      <SubscribeIntegrationsModal
        isOpen={showSubscribeModal}
        onClose={() => setShowSubscribeModal(false)}
        integration={selectedIntegration}
      />
    </div>
  );
}
