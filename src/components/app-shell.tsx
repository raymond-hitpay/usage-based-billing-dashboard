"use client";

import * as React from "react";
import { Sidebar, type SubView, type TabId } from "./sidebar";
import { TopBar } from "./top-bar";
import { PaymentLinksPage } from "./payment-links-page";
import { DummyPage } from "./dummy-page";
import { AgentPanel } from "./agent-panel";
import { AccountVerificationPage } from "./account-verification-page";

const tabDefaults: Record<TabId, string> = {
  payments: "Overview",
  commerce: "Web POS",
  finance: "Overview",
};

const settingsDefaultByTab: Partial<Record<TabId, string>> = {
  payments: "Business Details",
  commerce: "General Settings",
};

export function AppShell() {
  const [activeTab, setActiveTab] = React.useState<TabId>("payments");
  const [subView, setSubView] = React.useState<SubView>(null);
  const [selectedPage, setSelectedPage] = React.useState<string>(
    tabDefaults.payments
  );
  const [agentOpen, setAgentOpen] = React.useState(false);
  const [verificationStatus, setVerificationStatus] = React.useState<"idle" | "verifying" | "verified">("idle");

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

  const showCharges =
    activeTab === "payments" &&
    subView === null &&
    selectedPage === "Transactions";

  return (
    <div className="flex h-screen w-full flex-col bg-slate-100">
      <TopBar
        activeTab={activeTab}
        onChangeTab={handleTabChange}
        onOpenAgent={() => setAgentOpen(true)}
      />
      <div className="flex flex-1 overflow-hidden pb-3 pr-3">
        <Sidebar
          activeTab={activeTab}
          subView={subView}
          selectedPage={selectedPage}
          onSubViewChange={handleSubViewChange}
          onSelectPage={setSelectedPage}
        />
        <main className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {showCharges ? (
            <PaymentLinksPage />
          ) : selectedPage === "Account Verification" ? (
            <AccountVerificationPage
              onClose={() => setSelectedPage("Business Details")}
              verificationStatus={verificationStatus}
              onSubmit={() => setVerificationStatus("verifying")}
              onMarkVerified={() => setVerificationStatus("verified")}
            />
          ) : (
            <DummyPage title={selectedPage} />
          )}
        </main>
        <AgentPanel open={agentOpen} onClose={() => setAgentOpen(false)} />
      </div>
    </div>
  );
}
