"use client";

import * as React from "react";
import { MapPin, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/* ── Types ── */

type PricingModel = "volume" | "graduated";

/* ── Monthly Spend mock data ── */

interface MonthlySpend {
  month: string;
  cashTransactions: number;
  smsReceipts: number;
  quickbooks: number;
}

// Graduated pricing: each unit charged at its tier's rate
const MONTHLY_SPEND_GRADUATED: MonthlySpend[] = [
  { month: "Dec", cashTransactions: 0, smsReceipts: 12.50, quickbooks: 0 },
  { month: "Jan", cashTransactions: 8.40, smsReceipts: 15.20, quickbooks: 0 },
  { month: "Feb", cashTransactions: 420.00, smsReceipts: 185.50, quickbooks: 9.00 },
  { month: "Mar", cashTransactions: 0, smsReceipts: 0, quickbooks: 9.00 },
  { month: "Apr", cashTransactions: 20.75, smsReceipts: 5.25, quickbooks: 9.00 },
  { month: "May", cashTransactions: 36.30, smsReceipts: 12.80, quickbooks: 9.00 },
  { month: "Jun", cashTransactions: 48.60, smsReceipts: 18.40, quickbooks: 9.00 },
];

// Volume pricing: all billable units at the tier rate (after free 50)
const MONTHLY_SPEND_VOLUME: MonthlySpend[] = [
  { month: "Dec", cashTransactions: 0, smsReceipts: 6.25, quickbooks: 0 },
  { month: "Jan", cashTransactions: 3.50, smsReceipts: 8.00, quickbooks: 0 },
  { month: "Feb", cashTransactions: 244.50, smsReceipts: 91.50, quickbooks: 9.00 },
  { month: "Mar", cashTransactions: 0, smsReceipts: 0, quickbooks: 9.00 },
  { month: "Apr", cashTransactions: 11.10, smsReceipts: 2.25, quickbooks: 9.00 },
  { month: "May", cashTransactions: 27.90, smsReceipts: 8.00, quickbooks: 9.00 },
  { month: "Jun", cashTransactions: 35.70, smsReceipts: 8.34, quickbooks: 9.00 },
];

/* ── Monthly Spend Chart ── */

function MonthlySpendChart({ pricingModel }: { pricingModel: PricingModel }) {
  const MONTHLY_SPEND = pricingModel === "volume" ? MONTHLY_SPEND_VOLUME : MONTHLY_SPEND_GRADUATED;
  const maxTotal = Math.max(
    ...MONTHLY_SPEND.map((m) => m.cashTransactions + m.smsReceipts + m.quickbooks),
    1
  );
  // Round up to nearest nice number for Y-axis
  const yMax = Math.ceil(maxTotal / 100) * 100 || 100;
  const yLabels = [
    `$${yMax}`,
    `$${Math.round(yMax * 0.66)}`,
    `$${Math.round(yMax * 0.33)}`,
    "$0",
  ];

  const chartHeight = 200;

  return (
    <div className="rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-slate-900">
          Monthly Spend
        </h2>
        {/* Legend */}
        <div className="flex items-center gap-5 text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
            Cash Transactions
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-orange-400" />
            SMS Receipts
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            QuickBooks
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {/* Y-axis labels */}
        <div
          className="flex w-12 shrink-0 flex-col justify-between text-right text-xs tabular-nums text-slate-400 pb-6"
          style={{ height: chartHeight }}
        >
          {yLabels.map((v) => (
            <span key={v}>{v}</span>
          ))}
        </div>

        {/* Bars */}
        <div className="flex flex-1 flex-col">
          <div
            className="relative flex items-end gap-3 border-b border-l border-slate-100"
            style={{ height: chartHeight }}
          >
            {/* Horizontal grid lines */}
            {[0, 33, 66].map((pct) => (
              <div
                key={pct}
                className="pointer-events-none absolute w-full border-t border-slate-100"
                style={{ bottom: `${pct}%` }}
              />
            ))}

            {MONTHLY_SPEND.map((m) => {
              const cashH = (m.cashTransactions / yMax) * 100;
              const smsH = (m.smsReceipts / yMax) * 100;
              const qbH = (m.quickbooks / yMax) * 100;
              const total = m.cashTransactions + m.smsReceipts + m.quickbooks;

              // Determine which segment is on top for rounded corners
              const topSegment = qbH > 0 ? "qb" : smsH > 0 ? "sms" : "cash";

              return (
                <div
                  key={m.month}
                  className="group relative flex flex-1 flex-col items-center justify-end"
                >
                  {/* Stacked bar */}
                  <div className="flex w-8 flex-col items-stretch">
                    {/* QuickBooks (top) */}
                    {qbH > 0 && (
                      <div
                        className={`w-full bg-emerald-400 ${topSegment === "qb" ? "rounded-t" : ""}`}
                        style={{ height: `${(qbH / 100) * chartHeight}px` }}
                      />
                    )}
                    {/* SMS (middle) */}
                    {smsH > 0 && (
                      <div
                        className={`w-full bg-orange-400 ${topSegment === "sms" ? "rounded-t" : ""}`}
                        style={{ height: `${(smsH / 100) * chartHeight}px` }}
                      />
                    )}
                    {/* Cash (bottom) */}
                    {cashH > 0 && (
                      <div
                        className={`w-full bg-cyan-400 ${topSegment === "cash" ? "rounded-t" : ""}`}
                        style={{ height: `${(cashH / 100) * chartHeight}px` }}
                      />
                    )}
                  </div>

                  {/* Tooltip */}
                  {total > 0 && (
                    <div className="pointer-events-none absolute bottom-full z-10 mb-2 whitespace-nowrap rounded-md bg-slate-800 px-3 py-1.5 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                      <p className="font-medium">{m.month}</p>
                      <p>Cash: S${m.cashTransactions.toFixed(2)}</p>
                      <p>SMS: S${m.smsReceipts.toFixed(2)}</p>
                      {m.quickbooks > 0 && <p>QuickBooks: S${m.quickbooks.toFixed(2)}</p>}
                      <p className="mt-0.5 border-t border-slate-600 pt-0.5 font-medium">
                        Total: S${total.toFixed(2)}
                      </p>
                      <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-slate-800" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* X-axis labels */}
          <div className="mt-2 flex gap-3">
            {MONTHLY_SPEND.map((m) => (
              <div
                key={m.month}
                className="flex-1 text-center text-xs text-slate-400"
              >
                {m.month}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Invoice history ── */

interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: string;
  status: "Paid" | "Pending";
}

const INVOICES_GRADUATED: Invoice[] = [
  { id: "INV-2026-06", date: "Jun 1, 2026", description: "Cash Txns (1,240) + SMS (328) + QuickBooks", amount: "S$76.00", status: "Paid" },
  { id: "INV-2026-05", date: "May 1, 2026", description: "Cash Txns (980) + SMS (210) + QuickBooks", amount: "S$58.10", status: "Paid" },
  { id: "INV-2026-04", date: "Apr 1, 2026", description: "Cash Txns (420) + SMS (95) + QuickBooks", amount: "S$35.00", status: "Paid" },
  { id: "INV-2026-03", date: "Mar 1, 2026", description: "QuickBooks", amount: "S$9.00", status: "Paid" },
  { id: "INV-2026-02", date: "Feb 1, 2026", description: "Cash Txns (8,200) + SMS (3,100) + QuickBooks", amount: "S$614.50", status: "Paid" },
];

const INVOICES_VOLUME: Invoice[] = [
  { id: "INV-2026-06", date: "Jun 1, 2026", description: "Cash Txns (1,240) + SMS (328) + QuickBooks", amount: "S$53.04", status: "Paid" },
  { id: "INV-2026-05", date: "May 1, 2026", description: "Cash Txns (980) + SMS (210) + QuickBooks", amount: "S$44.90", status: "Paid" },
  { id: "INV-2026-04", date: "Apr 1, 2026", description: "Cash Txns (420) + SMS (95) + QuickBooks", amount: "S$22.35", status: "Paid" },
  { id: "INV-2026-03", date: "Mar 1, 2026", description: "QuickBooks", amount: "S$9.00", status: "Paid" },
  { id: "INV-2026-02", date: "Feb 1, 2026", description: "Cash Txns (8,200) + SMS (3,100) + QuickBooks", amount: "S$345.00", status: "Paid" },
];

function InvoiceHistoryCard({ pricingModel }: { pricingModel: PricingModel }) {
  const INVOICES = pricingModel === "volume" ? INVOICES_VOLUME : INVOICES_GRADUATED;
  return (
    <div className="rounded-xl border border-slate-200 p-6">
      <h2 className="text-base font-semibold text-slate-900">
        Payment History
      </h2>
      <div className="mt-4 overflow-hidden rounded-lg border border-slate-100">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs text-slate-500">
              <th className="px-4 py-2.5 text-left font-medium">Invoice</th>
              <th className="px-4 py-2.5 text-left font-medium">Date</th>
              <th className="px-4 py-2.5 text-left font-medium">
                Description
              </th>
              <th className="px-4 py-2.5 text-right font-medium">Amount</th>
              <th className="px-4 py-2.5 text-left font-medium">Status</th>
              <th className="px-4 py-2.5 text-right font-medium" />
            </tr>
          </thead>
          <tbody>
            {INVOICES.map((inv) => (
              <tr
                key={inv.id}
                className="border-t border-slate-100 cursor-pointer transition-colors hover:bg-slate-50"
                onClick={() => window.open(`/invoice/${inv.id}?model=${pricingModel}`, '_blank')}
              >
                <td className="px-4 py-3 font-medium text-blue-600">
                  {inv.id}
                </td>
                <td className="px-4 py-3 text-slate-500">{inv.date}</td>
                <td className="px-4 py-3 text-slate-500">{inv.description}</td>
                <td className="px-4 py-3 text-right tabular-nums font-medium text-slate-900">
                  {inv.amount}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant={inv.status === "Paid" ? "success" : "warning"}
                    className="text-[10px]"
                  >
                    {inv.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className="text-sm font-medium text-blue-600 hover:text-blue-700">
                    View
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Billing email card ── */

function BillingEmailCard() {
  const [email, setEmail] = React.useState("nitin@mycatshop.com");

  return (
    <div className="rounded-xl border border-slate-200 p-6">
      <h2 className="text-base font-semibold text-slate-900">Billing email</h2>
      <p className="mt-1 text-sm text-slate-500">
        Invoices will be sent to the following email address.
      </p>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mt-3 max-w-sm bg-slate-50"
      />
      <Button size="sm" className="mt-3 h-8">
        Save
      </Button>
    </div>
  );
}

/* ── Payment methods card ── */

function PaymentMethodsCard() {
  return (
    <div className="rounded-xl border border-slate-200 p-6">
      <h2 className="text-base font-semibold text-slate-900">
        Payment methods
      </h2>
      <div className="mt-4 flex items-center gap-3 text-sm">
        <span className="text-slate-700">Mastercard ending in 4090</span>
        <Badge variant="success" className="text-[10px]">
          Default
        </Badge>
        <span className="ml-auto text-slate-500">Expires at 9/2027</span>
        <button className="text-slate-400 hover:text-slate-600">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
      <button className="mt-4 rounded-md border border-slate-300 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
        Add payment method
      </button>
    </div>
  );
}

/* ── Billing address card ── */

function BillingAddressCard() {
  return (
    <div className="rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-900">
          Billing address
        </h2>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
          Edit
        </button>
      </div>
      <div className="mt-3 flex items-start gap-3 text-sm text-slate-600">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
        <div>
          <p className="font-medium text-slate-700">My Cat Shop</p>
          <p>123 Orchard Road, #04-01</p>
          <p>Singapore 238858</p>
        </div>
      </div>
    </div>
  );
}

/* ── Main page ── */

export function BillingPage({ pricingModel }: { pricingModel: PricingModel }) {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="border-b px-8 py-5">
        <h1 className="text-xl font-semibold text-slate-900">Billing</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Manage invoices, payment, and spend alerts in one place.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6 overflow-y-auto px-8 py-6">
        <MonthlySpendChart pricingModel={pricingModel} />
        <InvoiceHistoryCard pricingModel={pricingModel} />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <BillingEmailCard />
          <PaymentMethodsCard />
        </div>
        <BillingAddressCard />
      </div>
    </div>
  );
}
