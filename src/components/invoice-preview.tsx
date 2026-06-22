"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/* ── Types ── */

interface TierBreakdownItem {
  tier: string;
  range: string;
  rate: string;
  units: number;
  cost: string;
}

interface InvoiceLineItem {
  description: string;
  quantity: string;
  rate: string;
  amount: string;
  tierBreakdown?: TierBreakdownItem[];
}

interface InvoiceData {
  id: string;
  date: string;
  dueDate: string;
  status: "Paid" | "Pending";
  billFrom: { name: string; address: string[] };
  billTo: { name: string; address: string[]; email: string };
  lineItems: InvoiceLineItem[];
  subtotal: string;
  tax: string;
  total: string;
}

type PricingModel = "volume" | "graduated";

/* ── Mock data ── */

const BILL_FROM = {
  name: "HitPay Pte. Ltd.",
  address: ["3 Fraser Street, #05-21 DUO Tower", "Singapore 189352"],
};

const BILL_TO = {
  name: "My Cat Shop",
  address: ["123 Orchard Road, #04-01", "Singapore 238858"],
  email: "nitin@mycatshop.com",
};

const MOCK_INVOICES_GRADUATED: Record<string, InvoiceData> = {
  "INV-2026-06": {
    id: "INV-2026-06",
    date: "Jun 1, 2026",
    dueDate: "Jun 15, 2026",
    status: "Paid",
    billFrom: BILL_FROM,
    billTo: BILL_TO,
    lineItems: [
      {
        description: "Cash Transactions",
        quantity: "1,240 txns",
        rate: "Graduated",
        amount: "S$39.20",
        tierBreakdown: [
          { tier: "Tier 1", range: "1 – 50", rate: "Free", units: 50, cost: "S$0.00" },
          { tier: "Tier 2", range: "51 – 500", rate: "S$0.05/unit", units: 450, cost: "S$22.50" },
          { tier: "Tier 3", range: "501 – 1,240", rate: "S$0.03/unit", units: 740, cost: "S$22.20" },
        ],
      },
      {
        description: "SMS Receipts",
        quantity: "328 receipts",
        rate: "Graduated",
        amount: "S$13.90",
        tierBreakdown: [
          { tier: "Tier 1", range: "1 – 50", rate: "Free", units: 50, cost: "S$0.00" },
          { tier: "Tier 2", range: "51 – 328", rate: "S$0.05/unit", units: 278, cost: "S$13.90" },
        ],
      },
      {
        description: "QuickBooks Online",
        quantity: "1 account",
        rate: "S$9.00/mo",
        amount: "S$9.00",
      },
    ],
    subtotal: "S$62.10",
    tax: "S$5.59",
    total: "S$67.69",
  },
  "INV-2026-05": {
    id: "INV-2026-05",
    date: "May 1, 2026",
    dueDate: "May 15, 2026",
    status: "Paid",
    billFrom: BILL_FROM,
    billTo: BILL_TO,
    lineItems: [
      {
        description: "Cash Transactions",
        quantity: "980 txns",
        rate: "Graduated",
        amount: "S$30.30",
        tierBreakdown: [
          { tier: "Tier 1", range: "1 – 50", rate: "Free", units: 50, cost: "S$0.00" },
          { tier: "Tier 2", range: "51 – 500", rate: "S$0.05/unit", units: 450, cost: "S$22.50" },
          { tier: "Tier 3", range: "501 – 980", rate: "S$0.03/unit", units: 480, cost: "S$14.40" },
        ],
      },
      {
        description: "SMS Receipts",
        quantity: "210 receipts",
        rate: "Graduated",
        amount: "S$8.00",
        tierBreakdown: [
          { tier: "Tier 1", range: "1 – 50", rate: "Free", units: 50, cost: "S$0.00" },
          { tier: "Tier 2", range: "51 – 210", rate: "S$0.05/unit", units: 160, cost: "S$8.00" },
        ],
      },
      {
        description: "QuickBooks Online",
        quantity: "1 account",
        rate: "S$9.00/mo",
        amount: "S$9.00",
      },
    ],
    subtotal: "S$49.10",
    tax: "S$9.00",
    total: "S$58.10",
  },
  "INV-2026-04": {
    id: "INV-2026-04",
    date: "Apr 1, 2026",
    dueDate: "Apr 15, 2026",
    status: "Paid",
    billFrom: BILL_FROM,
    billTo: BILL_TO,
    lineItems: [
      {
        description: "Cash Transactions",
        quantity: "420 txns",
        rate: "Graduated",
        amount: "S$18.50",
        tierBreakdown: [
          { tier: "Tier 1", range: "1 – 50", rate: "Free", units: 50, cost: "S$0.00" },
          { tier: "Tier 2", range: "51 – 420", rate: "S$0.05/unit", units: 370, cost: "S$18.50" },
        ],
      },
      {
        description: "SMS Receipts",
        quantity: "95 receipts",
        rate: "Graduated",
        amount: "S$2.25",
        tierBreakdown: [
          { tier: "Tier 1", range: "1 – 50", rate: "Free", units: 50, cost: "S$0.00" },
          { tier: "Tier 2", range: "51 – 95", rate: "S$0.05/unit", units: 45, cost: "S$2.25" },
        ],
      },
      {
        description: "QuickBooks Online",
        quantity: "1 account",
        rate: "S$9.00/mo",
        amount: "S$9.00",
      },
    ],
    subtotal: "S$26.00",
    tax: "S$9.00",
    total: "S$35.00",
  },
  "INV-2026-03": {
    id: "INV-2026-03",
    date: "Mar 1, 2026",
    dueDate: "Mar 15, 2026",
    status: "Paid",
    billFrom: BILL_FROM,
    billTo: BILL_TO,
    lineItems: [
      {
        description: "QuickBooks Online",
        quantity: "1 account",
        rate: "S$9.00/mo",
        amount: "S$9.00",
      },
    ],
    subtotal: "S$9.00",
    tax: "S$0.00",
    total: "S$9.00",
  },
  "INV-2026-02": {
    id: "INV-2026-02",
    date: "Feb 1, 2026",
    dueDate: "Feb 15, 2026",
    status: "Paid",
    billFrom: BILL_FROM,
    billTo: BILL_TO,
    lineItems: [
      {
        description: "Cash Transactions",
        quantity: "8,200 txns",
        rate: "Graduated",
        amount: "S$420.00",
        tierBreakdown: [
          { tier: "Tier 1", range: "1 – 50", rate: "Free", units: 50, cost: "S$0.00" },
          { tier: "Tier 2", range: "51 – 500", rate: "S$0.05/unit", units: 450, cost: "S$22.50" },
          { tier: "Tier 3", range: "501 – 2,000", rate: "S$0.03/unit", units: 1500, cost: "S$45.00" },
          { tier: "Tier 4", range: "2,001 – 5,000", rate: "S$0.01/unit", units: 3000, cost: "S$30.00" },
          { tier: "Tier 5", range: "5,001 – 8,200", rate: "S$0.005/unit", units: 3200, cost: "S$16.00" },
        ],
      },
      {
        description: "SMS Receipts",
        quantity: "3,100 receipts",
        rate: "Graduated",
        amount: "S$185.50",
        tierBreakdown: [
          { tier: "Tier 1", range: "1 – 50", rate: "Free", units: 50, cost: "S$0.00" },
          { tier: "Tier 2", range: "51 – 500", rate: "S$0.05/unit", units: 450, cost: "S$22.50" },
          { tier: "Tier 3", range: "501 – 2,000", rate: "S$0.03/unit", units: 1500, cost: "S$45.00" },
          { tier: "Tier 4", range: "2,001 – 3,100", rate: "S$0.01/unit", units: 1100, cost: "S$11.00" },
        ],
      },
      {
        description: "QuickBooks Online",
        quantity: "1 account",
        rate: "S$9.00/mo",
        amount: "S$9.00",
      },
    ],
    subtotal: "S$614.50",
    tax: "S$0.00",
    total: "S$614.50",
  },
};

// Volume pricing: all billable units at the single tier rate (after 50 free)
const MOCK_INVOICES_VOLUME: Record<string, InvoiceData> = {
  "INV-2026-06": {
    id: "INV-2026-06", date: "Jun 1, 2026", dueDate: "Jun 15, 2026", status: "Paid",
    billFrom: BILL_FROM, billTo: BILL_TO,
    lineItems: [
      { description: "Cash Transactions", quantity: "1,240 txns", rate: "Volume · S$0.03/unit", amount: "S$35.70" },
      { description: "SMS Receipts", quantity: "328 receipts", rate: "Volume · S$0.05/unit", amount: "S$13.90" },
      { description: "QuickBooks Online", quantity: "1 account", rate: "S$9.00/mo", amount: "S$9.00" },
    ],
    subtotal: "S$58.60", tax: "S$0.00", total: "S$58.60",
  },
  "INV-2026-05": {
    id: "INV-2026-05", date: "May 1, 2026", dueDate: "May 15, 2026", status: "Paid",
    billFrom: BILL_FROM, billTo: BILL_TO,
    lineItems: [
      { description: "Cash Transactions", quantity: "980 txns", rate: "Volume · S$0.03/unit", amount: "S$27.90" },
      { description: "SMS Receipts", quantity: "210 receipts", rate: "Volume · S$0.05/unit", amount: "S$8.00" },
      { description: "QuickBooks Online", quantity: "1 account", rate: "S$9.00/mo", amount: "S$9.00" },
    ],
    subtotal: "S$44.90", tax: "S$0.00", total: "S$44.90",
  },
  "INV-2026-04": {
    id: "INV-2026-04", date: "Apr 1, 2026", dueDate: "Apr 15, 2026", status: "Paid",
    billFrom: BILL_FROM, billTo: BILL_TO,
    lineItems: [
      { description: "Cash Transactions", quantity: "420 txns", rate: "Volume · S$0.05/unit", amount: "S$18.50" },
      { description: "SMS Receipts", quantity: "95 receipts", rate: "Volume · S$0.05/unit", amount: "S$2.25" },
      { description: "QuickBooks Online", quantity: "1 account", rate: "S$9.00/mo", amount: "S$9.00" },
    ],
    subtotal: "S$29.75", tax: "S$0.00", total: "S$29.75",
  },
  "INV-2026-03": {
    id: "INV-2026-03", date: "Mar 1, 2026", dueDate: "Mar 15, 2026", status: "Paid",
    billFrom: BILL_FROM, billTo: BILL_TO,
    lineItems: [
      { description: "QuickBooks Online", quantity: "1 account", rate: "S$9.00/mo", amount: "S$9.00" },
    ],
    subtotal: "S$9.00", tax: "S$0.00", total: "S$9.00",
  },
  "INV-2026-02": {
    id: "INV-2026-02", date: "Feb 1, 2026", dueDate: "Feb 15, 2026", status: "Paid",
    billFrom: BILL_FROM, billTo: BILL_TO,
    lineItems: [
      { description: "Cash Transactions", quantity: "8,200 txns", rate: "Volume · S$0.005/unit", amount: "S$40.75" },
      { description: "SMS Receipts", quantity: "3,100 receipts", rate: "Volume · S$0.01/unit", amount: "S$30.50" },
      { description: "QuickBooks Online", quantity: "1 account", rate: "S$9.00/mo", amount: "S$9.00" },
    ],
    subtotal: "S$80.25", tax: "S$0.00", total: "S$80.25",
  },
};

/* ── Line item row ── */

function TierBreakdownTable({ breakdown }: { breakdown: TierBreakdownItem[] }) {
  return (
    <tr>
      <td colSpan={4} className="pb-2 pt-0">
        <div className="ml-6 pl-0">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-[10px] text-slate-400 uppercase tracking-wider">
                <th className="pb-1.5 pt-1 text-left font-medium w-16">Tier</th>
                <th className="pb-1.5 pt-1 text-left font-medium">Range</th>
                <th className="pb-1.5 pt-1 text-right font-medium">Rate</th>
                <th className="pb-1.5 pt-1 text-right font-medium w-16">Units</th>
                <th className="pb-1.5 pt-1 text-right font-medium w-20">Cost</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((tb) => (
                <tr key={tb.tier} className="border-t border-slate-100">
                  <td className="py-1 text-slate-400 font-medium">{tb.tier}</td>
                  <td className="py-1 tabular-nums text-slate-400">{tb.range}</td>
                  <td className="py-1 text-right tabular-nums text-slate-500">{tb.rate}</td>
                  <td className="py-1 text-right tabular-nums text-slate-500">{tb.units.toLocaleString()}</td>
                  <td className="py-1 text-right tabular-nums text-slate-600">{tb.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  );
}

function LineItemRow({ item, alwaysExpanded }: { item: InvoiceLineItem; alwaysExpanded?: boolean }) {
  const [expanded, setExpanded] = React.useState(false);
  const hasBreakdown = !!item.tierBreakdown?.length;
  const showBreakdown = alwaysExpanded ? hasBreakdown : expanded;

  return (
    <>
      <tr
        className={hasBreakdown && !alwaysExpanded ? "border-b border-slate-100 cursor-pointer transition-colors hover:bg-slate-50" : "border-b border-slate-100"}
        onClick={hasBreakdown && !alwaysExpanded ? () => setExpanded(!expanded) : undefined}
      >
        <td className="py-3 font-medium text-slate-700">
          <span className="flex items-center gap-1.5">
            {item.description}
            {hasBreakdown && !alwaysExpanded && (
              expanded
                ? <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
                : <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            )}
          </span>
        </td>
        <td className="py-3 text-slate-500">{item.quantity}</td>
        <td className="py-3 text-right text-slate-500">
          {item.rate}
        </td>
        <td className="py-3 text-right font-medium tabular-nums text-slate-900">
          {item.amount}
        </td>
      </tr>
      {showBreakdown && item.tierBreakdown && (
        <TierBreakdownTable breakdown={item.tierBreakdown} />
      )}
    </>
  );
}

/* ── Component ── */

export function InvoicePreview({
  invoiceId,
  pricingModel = "graduated",
}: {
  invoiceId: string;
  pricingModel?: PricingModel;
}) {
  const invoiceMap = pricingModel === "volume" ? MOCK_INVOICES_VOLUME : MOCK_INVOICES_GRADUATED;
  const invoice = invoiceMap[invoiceId];

  if (!invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-slate-900">
            Invoice not found
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            No invoice found for ID: {invoiceId}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 print:bg-white print:py-0">
      <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white shadow-sm print:border-0 print:shadow-none">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-8 py-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">HitPay</h1>
            <p className="mt-0.5 text-sm text-slate-500">Payment Platform</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              <h2 className="text-lg font-semibold text-slate-900">
                {invoice.id}
              </h2>
              <Badge
                variant={invoice.status === "Paid" ? "success" : "warning"}
              >
                {invoice.status}
              </Badge>
            </div>
            <p className="mt-1 text-sm text-slate-500">TAX INVOICE</p>
          </div>
        </div>

        {/* Dates */}
        <div className="flex gap-8 border-b border-slate-100 px-8 py-4">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Invoice Date
            </p>
            <p className="mt-0.5 text-sm font-medium text-slate-700">
              {invoice.date}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Due Date
            </p>
            <p className="mt-0.5 text-sm font-medium text-slate-700">
              {invoice.dueDate}
            </p>
          </div>
        </div>

        {/* Bill From / Bill To */}
        <div className="grid grid-cols-2 gap-8 border-b border-slate-100 px-8 py-5">
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              From
            </p>
            <p className="mt-1.5 text-sm font-semibold text-slate-900">
              {invoice.billFrom.name}
            </p>
            {invoice.billFrom.address.map((line) => (
              <p key={line} className="text-sm text-slate-500">
                {line}
              </p>
            ))}
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
              Bill To
            </p>
            <p className="mt-1.5 text-sm font-semibold text-slate-900">
              {invoice.billTo.name}
            </p>
            {invoice.billTo.address.map((line) => (
              <p key={line} className="text-sm text-slate-500">
                {line}
              </p>
            ))}
            <p className="text-sm text-slate-500">{invoice.billTo.email}</p>
          </div>
        </div>

        {/* Line items */}
        <div className="px-8 py-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs text-slate-400 uppercase tracking-wide">
                <th className="pb-2 text-left font-medium">Description</th>
                <th className="pb-2 text-left font-medium">Quantity</th>
                <th className="pb-2 text-right font-medium">Rate</th>
                <th className="pb-2 text-right font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item) => (
                <LineItemRow key={item.description} item={item} alwaysExpanded={pricingModel === "graduated"} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t border-slate-200 px-8 py-5">
          <div className="ml-auto max-w-xs space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="tabular-nums font-medium text-slate-700">
                {invoice.subtotal}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Tax (GST 9%)</span>
              <span className="tabular-nums font-medium text-slate-700">
                {invoice.tax}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2 text-base">
              <span className="font-semibold text-slate-900">Total</span>
              <span className="tabular-nums font-bold text-slate-900">
                {invoice.total}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 px-8 py-5 text-center">
          <p className="text-sm text-slate-400">
            Thank you for your business.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            HitPay Pte. Ltd. &middot; UEN 201709244Z
          </p>
        </div>
      </div>

      {/* Print button */}
      <div className="mx-auto mt-4 max-w-3xl text-center print:hidden">
        <button
          onClick={() => window.print()}
          className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          Print Invoice
        </button>
      </div>
    </div>
  );
}
