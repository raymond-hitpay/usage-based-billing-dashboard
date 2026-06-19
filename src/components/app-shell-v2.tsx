"use client";

import * as React from "react";
import { SidebarV2 } from "./sidebar-v2";
import {
  settingsDefaultByTab,
  tabDefaults,
  type SubView,
  type TabId,
} from "./nav-config";
import { PaymentLinksPage, PaymentLinksEmptyPage } from "./payment-links-page";
import { StaticQRsEmptyPage, InvoicingEmptyPage, RecurringBillingEmptyPage } from "./empty-pages";
import { DummyPage } from "./dummy-page";
import { AgentPanel } from "./agent-panel";
import { AccountVerificationPage } from "./account-verification-page";
import { BankAccountsPage } from "./bank-accounts-page";
import { PaymentMethodsSetupPage } from "./payment-methods-setup-page";
import { OverviewPage } from "./overview-page";
import { SetupGuideFloating, SetupGuidePill } from "./setup-guide-floating";
import { SetupGuideSidePanel } from "./setup-guide-sidepanel";
import { SETUP_GROUPS, type SetupGroup, type SetupGuideVariant } from "@/lib/setup-guide-data";

export function AppShellV2() {
  const [activeTab, setActiveTab] = React.useState<TabId>("payments");
  const [subView, setSubView] = React.useState<SubView>(null);
  const [selectedPage, setSelectedPage] = React.useState<string>(
    tabDefaults.payments
  );
  const [agentOpen, setAgentOpen] = React.useState(false);

  // Setup guide state — lifted here so the floating widget persists across pages
  const [setupGuideVariant, setSetupGuideVariant] = React.useState<SetupGuideVariant>("floating");
  const [setupGuideOpen, setSetupGuideOpen] = React.useState(false);

  // Spotlight — shown once on first Overview visit in floating mode
  const [spotlightSeen, setSpotlightSeen] = React.useState(false);

  // Account verification status
  const [verificationStatus, setVerificationStatus] = React.useState<"idle" | "verifying" | "verified">("idle");
  const [setupGroups, setSetupGroups] = React.useState<SetupGroup[]>(SETUP_GROUPS);

  // Anchor for payment methods page (e.g. "local-qr", "cards", "crossborder")
  const [paymentMethodsAnchor, setPaymentMethodsAnchor] = React.useState<string>("");

  const handleSubmitVerification = () => {
    setVerificationStatus("verifying");
    setSetupGroups((prev) =>
      prev.map((g) => ({
        ...g,
        steps: g.steps.map((s) =>
          s.id === "account-verification" ? { ...s, verificationStatus: "verifying" as const } : s
        ),
      }))
    );
  };

  const handleMarkVerified = () => {
    setVerificationStatus("verified");
    setSetupGroups((prev) =>
      prev.map((g) => ({
        ...g,
        steps: g.steps.map((s) =>
          s.id === "account-verification"
            ? { ...s, completed: true, verificationStatus: "verified" as const }
            : s
        ),
      }))
    );
  };

  const handleVariantChange = (v: SetupGuideVariant) => {
    setSetupGuideVariant(v);
    if (v === "floating") setSpotlightSeen(false); // re-show spotlight when switching back
  };

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab);
    setSubView(null);
    setSelectedPage(tabDefaults[tab]);
  };

  const handleSubViewChange = (view: SubView) => {
    setSubView(view);
    if (view === "settings") {
      setSelectedPage(
        settingsDefaultByTab[activeTab] ?? "Business Details"
      );
    } else {
      setSelectedPage(tabDefaults[activeTab]);
    }
  };

  const handleMarkStepComplete = (stepId: string) => {
    setSetupGroups((prev) =>
      prev.map((g) => ({
        ...g,
        steps: g.steps.map((s) =>
          s.id === stepId ? { ...s, completed: true } : s
        ),
      }))
    );
  };

  const handleNavigate = (pageWithAnchor: string) => {
    // Parse optional anchor (e.g. "Payment Methods#local-qr")
    const [page, anchor] = pageWithAnchor.split("#");
    setPaymentMethodsAnchor(anchor ?? "");
    // Close the setup guide panel when navigating
    setSetupGuideOpen(false);
    // If it's a settings page, switch to settings view
    const settingsPages = [
      "Business Details", "Account Verification", "Bank Accounts",
      "Staff", "Audit Logs", "Checkout Customisation", "Notifications",
      "Email Templates", "Partners", "Platform",
    ];
    // Pages that live in non-payments tabs
    const commercePages = ["Web POS", "Orders", "Products", "Customers", "Discounts", "Coupons", "Card Terminals", "Mall GTO Integration", "Store Design", "Pages", "Media", "Booking", "Domain", "Shipping & Pickup", "Locations"];
    const financePages = ["Cash Flow", "Bills", "Vendors", "Approvals", "Beneficiaries", "Transfer History", "Employee Spend", "Payroll", "Chargebacks & Disputes", "Approval Rules", "Fee Invoice", "Reconciliation", "Statements", "Tax Reports", "Accounting Sync"];
    if (settingsPages.includes(page)) {
      setSubView("settings");
    } else if (commercePages.includes(page)) {
      setActiveTab("commerce");
      setSubView(null);
    } else if (financePages.includes(page)) {
      setActiveTab("finance");
      setSubView(null);
    } else {
      setActiveTab("payments");
      setSubView(null);
    }
    setSelectedPage(page);
  };

  const showCharges =
    activeTab === "payments" &&
    subView === null &&
    selectedPage === "Transactions";

  const showPaymentLinks =
    activeTab === "payments" &&
    subView === null &&
    selectedPage === "Payment Links";

  const showOverview =
    activeTab === "payments" &&
    subView === null &&
    selectedPage === "Overview";

  const showStaticQRs =
    activeTab === "payments" &&
    subView === null &&
    selectedPage === "Static QRs";

  const INVOICING_PAGES = ["Invoicing", "All Invoices", "Repeating", "Products"];
  const showInvoicing =
    activeTab === "payments" &&
    subView === null &&
    INVOICING_PAGES.includes(selectedPage);

  const RECURRING_PAGES = ["Recurring Billing", "Plans", "Subscriptions"];
  const showRecurringBilling =
    activeTab === "payments" &&
    subView === null &&
    RECURRING_PAGES.includes(selectedPage);

  const showVerification = selectedPage === "Account Verification";

  // Track where to go back to when closing verification
  const [preVerificationPage, setPreVerificationPage] = React.useState<string>("Overview");

  const handleNavigateWithVerificationTracking = (page: string) => {
    if (page === "Account Verification") {
      setPreVerificationPage(selectedPage);
    }
    handleNavigate(page);
  };

  return (
    <div className="relative flex h-screen w-full gap-3 bg-slate-100 p-3">
      <SidebarV2
        activeTab={activeTab}
        subView={subView}
        selectedPage={selectedPage}
        onChangeTab={handleTabChange}
        onSubViewChange={handleSubViewChange}
        onSelectPage={setSelectedPage}
        onOpenAgent={() => setAgentOpen(true)}
      />
      <main className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {showCharges ? (
          <PaymentLinksPage />
        ) : showPaymentLinks ? (
          <PaymentLinksEmptyPage onActivate={() => handleNavigate("Account Verification")} />
        ) : showStaticQRs ? (
          <StaticQRsEmptyPage onActivate={() => handleNavigate("Account Verification")} />
        ) : showInvoicing ? (
          <InvoicingEmptyPage onActivate={() => handleNavigate("Account Verification")} pageTitle={selectedPage} />
        ) : showRecurringBilling ? (
          <RecurringBillingEmptyPage onActivate={() => handleNavigate("Account Verification")} pageTitle={selectedPage} />
        ) : showOverview ? (
          <OverviewPage
            variant={setupGuideVariant}
            onVariantChange={handleVariantChange}
            onOpenSetupGuide={() => setSetupGuideOpen(true)}
            onNavigate={handleNavigateWithVerificationTracking}
            setupGroups={setupGroups}
          />
        ) : (
          <DummyPage title={selectedPage} />
        )}
      </main>
      <AgentPanel open={agentOpen} onClose={() => setAgentOpen(false)} />

      {/* ── Setup Guide: Version A — Floating widget ── */}
      {setupGuideVariant === "floating" && (() => {
        const showSpotlight = showOverview && !spotlightSeen;
        const dismissSpotlight = () => {
          setSpotlightSeen(true);
          setSetupGuideOpen(false);
        };
        return (
          <>
            {/* Spotlight overlay */}
            {showSpotlight && (
              <>
                {/* Gradient wash rising from the bottom — stronger blue/indigo tones */}
                <div
                  className="fixed inset-0 z-40 pointer-events-auto"
                  style={{
                    background: `
                      linear-gradient(to top,
                        rgba(191, 219, 254, 0.99) 0%,
                        rgba(199, 210, 254, 0.97) 20%,
                        rgba(224, 231, 255, 0.90) 40%,
                        rgba(238, 242, 255, 0.60) 60%,
                        rgba(238, 242, 255, 0.15) 75%,
                        transparent 88%
                      ),
                      radial-gradient(ellipse 80% 50% at 60% 100%, rgba(99, 102, 241, 0.45) 0%, transparent 70%)
                    `,
                  }}
                  onClick={dismissSpotlight}
                />

                {/* Callout text — large, dark, front and centre in the gradient zone */}
                <div className="fixed bottom-10 right-[360px] z-50 max-w-sm pointer-events-auto">
                  <h3 className="text-3xl font-bold text-slate-900 leading-tight mb-3">
                    Let's complete your<br />account setup
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    A few quick steps to unlock payments, payouts,<br />and the full HitPay experience.
                  </p>
                  <button
                    onClick={dismissSpotlight}
                    className="rounded-lg border border-slate-400 bg-white px-5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    Got it
                  </button>
                </div>
              </>
            )}

            {/* The widget itself — always expanded during spotlight */}
            {(showSpotlight || setupGuideOpen) ? (
              <SetupGuideFloating
                open={true}
                onClose={showSpotlight ? dismissSpotlight : () => setSetupGuideOpen(false)}
                onNavigate={handleNavigate}
                groups={setupGroups}
              />
            ) : (
              <SetupGuidePill
                onClick={() => setSetupGuideOpen(true)}
                onNavigate={handleNavigateWithVerificationTracking}
                groups={setupGroups}
              />
            )}
          </>
        );
      })()}

      {/* ── Setup Guide: Version B — Slide-in side panel ── */}
      {setupGuideVariant === "panel" && (
        <SetupGuideSidePanel
          open={setupGuideOpen}
          onClose={() => setSetupGuideOpen(false)}
          onNavigate={handleNavigateWithVerificationTracking}
          groups={setupGroups}
        />
      )}

      {/* ── Account Verification: full-screen overlay ── */}
      {showVerification && (
        <AccountVerificationPage
          onClose={() => {
            setSelectedPage(preVerificationPage);
            setSubView(null);
          }}
          verificationStatus={verificationStatus}
          onSubmit={handleSubmitVerification}
          onMarkVerified={handleMarkVerified}
        />
      )}

      {/* ── Bank Accounts: full-screen overlay ── */}
      {selectedPage === "Bank Accounts" && (
        <BankAccountsPage
          onClose={() => handleNavigate("Overview")}
          onSave={() => handleMarkStepComplete("bank-account")}
        />
      )}

      {/* ── Payment Methods setup: full-screen overlay ── */}
      {selectedPage === "Payment Methods" && (
        <PaymentMethodsSetupPage
          onClose={() => handleNavigate("Overview")}
          scrollTo={paymentMethodsAnchor}
          onTurnOn={(categoryId) => {
            // Enable the matching category on the enable-payments step
            setSetupGroups((prev) =>
              prev.map((g) => ({
                ...g,
                steps: g.steps.map((s) => {
                  if (s.id !== "enable-payments" || !s.categories) return s;
                  const updatedCategories = s.categories.map((c) =>
                    c.id === categoryId ? { ...c, enabled: true } : c
                  );
                  return {
                    ...s,
                    categories: updatedCategories,
                    completed: updatedCategories.some((c) => c.enabled),
                  };
                }),
              }))
            );
          }}
        />
      )}
    </div>
  );
}
