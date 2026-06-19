"use client";

import * as React from "react";
import { Search, SlidersHorizontal, Settings2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MethodIcon } from "@/components/method-icon";
import { charges, type ChargeStatus } from "@/lib/mock-data";
import { Plus, MessageCircle, DollarSign, Mail, CheckCircle } from "lucide-react";

function StatusBadge({ status }: { status: ChargeStatus }) {
  if (status === "succeeded") {
    return <Badge variant="success">Succeeded</Badge>;
  }
  return <Badge variant="danger">Refunded</Badge>;
}

function formatMoney(amount: number, currency?: string) {
  const value = amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return currency ? `${currency} ${value}` : value;
}

export function PaymentLinksPage() {
  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex h-full flex-col overflow-hidden bg-white">
        {/* Page header */}
        <div className="flex items-center justify-between border-b px-8 py-5">
          <h1 className="text-xl font-semibold text-slate-900">Charges</h1>
          <Button variant="outline" size="sm" className="h-9">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Tabs + actions */}
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b bg-white px-6 py-3">
            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="succeeded">Succeeded</TabsTrigger>
                <TabsTrigger value="refunded">Refunded</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-9">
                <Settings2 className="h-4 w-4" />
                Edit Column
              </Button>
            </div>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[150px] pl-6">Date</TableHead>
                <TableHead className="w-[180px]">Customer</TableHead>
                <TableHead className="w-[170px]">Charge ID</TableHead>
                <TableHead className="w-[110px]">Amount</TableHead>
                <TableHead className="w-[100px]">Fees</TableHead>
                <TableHead className="w-[110px]">Net Amount</TableHead>
                <TableHead className="w-[170px]">Method</TableHead>
                <TableHead className="w-[110px]">Status</TableHead>
                <TableHead className="pr-6">Staff</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {charges.map((c) => (
                <TableRow key={c.id} className="border-slate-100">
                  <TableCell className="pl-6 font-mono text-[13px] text-slate-700">
                    {c.date}
                  </TableCell>
                  <TableCell className="text-sm text-slate-700">
                    {c.customer === "N/A" ? (
                      <span className="text-slate-400">N/A</span>
                    ) : (
                      c.customer
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-[13px] text-slate-600">
                    {c.chargeId}
                  </TableCell>
                  <TableCell className="font-mono text-[13px] font-medium text-slate-900">
                    {formatMoney(c.amount, c.currency)}
                  </TableCell>
                  <TableCell className="font-mono text-[13px] text-slate-700">
                    {formatMoney(c.fees, c.currency)}
                  </TableCell>
                  <TableCell className="font-mono text-[13px] text-slate-900">
                    {formatMoney(c.netAmount)}
                  </TableCell>
                  <TableCell>
                    <MethodIcon method={c.method} cardLast4={c.cardLast4} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={c.status} />
                  </TableCell>
                  <TableCell className="pr-6 text-sm text-slate-700">
                    {c.staff === "N/A" ? (
                      <span className="text-slate-400">N/A</span>
                    ) : (
                      c.staff
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
}

/* ── Payment Links empty state ───────────────────────────────────── */
export function PaymentLinksEmptyPage({ onActivate }: { onActivate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5">
        <h1 className="text-xl font-semibold text-slate-900">Payment Links</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 text-slate-400 cursor-not-allowed" disabled>
            Bulk Create/Export
          </Button>
          <Button size="sm" className="h-9 gap-1.5 cursor-not-allowed opacity-50" disabled>
            <Plus className="h-4 w-4" /> New Payment Link
          </Button>
        </div>
      </div>

      {/* Empty state */}
      <div className="flex flex-1 flex-col items-center overflow-y-auto px-8 py-12 gap-10">

        {/* ① Hero — centered text + CTA, no surrounding card */}
        <div className="text-center max-w-lg">
          <h2 className="text-2xl font-bold text-slate-900 leading-snug">Create payment links, get paid instantly</h2>
          <p className="mt-2.5 text-sm text-slate-500 leading-relaxed">
            No code needed. Share a link with anyone and start accepting payments right away.
          </p>
          <button
            onClick={onActivate}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Activate Account
          </button>
        </div>

        {/* ② Large split card — feature bullets left, illustration right */}
        <div className="w-full max-w-2xl h-[220px] rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden flex">
          {/* Left: bullets */}
          <div className="flex flex-col justify-center px-8 py-8 flex-1 gap-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Payment Links</p>
              <p className="text-base font-semibold text-slate-900">Accept payments from anywhere</p>
            </div>
            <div className="flex flex-col gap-3">
              {[
                "Share easily on WhatsApp & messaging",
                "Receive open amounts & donations",
                "Collect customer emails directly",
              ].map(item => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: illustration */}
          <div className="flex items-center justify-center bg-white/60 px-8 py-6 shrink-0">
            <div className="flex items-center gap-3">
              {/* Browser mockup */}
              <div className="w-[170px] rounded-lg border border-slate-200 bg-white shadow-md overflow-hidden">
                <div className="flex items-center gap-1 border-b border-slate-100 bg-slate-50 px-2.5 py-1.5">
                  {["bg-red-400","bg-amber-400","bg-green-400"].map(c => (
                    <div key={c} className={`h-1.5 w-1.5 rounded-full ${c}`} />
                  ))}
                  <div className="ml-1.5 h-2.5 flex-1 rounded bg-slate-200" />
                </div>
                <div className="p-3 space-y-1.5">
                  <div className="text-center">
                    <p className="text-[9px] text-slate-400">You are paying</p>
                    <p className="text-base font-bold text-slate-900 font-mono">SGD 10.00</p>
                    <p className="text-[7px] text-slate-400 mt-0.5">For paying a 1,000g coffee beans</p>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    {["PayNow","Cards","GrabPay"].map(m => (
                      <div key={m} className="rounded border border-slate-200 py-0.5 text-center text-[6px] text-slate-500">{m}</div>
                    ))}
                  </div>
                  <div className="rounded bg-blue-600 py-1 text-center text-[8px] font-semibold text-white">
                    Pay SGD 10.00
                  </div>
                </div>
              </div>
              {/* Phone mockup */}
              <div className="w-[72px] rounded-[12px] border-2 border-slate-800 bg-slate-900 shadow-xl overflow-hidden shrink-0">
                <div className="flex justify-center pt-1.5 pb-0.5">
                  <div className="h-1 w-5 rounded-full bg-slate-700" />
                </div>
                <div className="px-1.5 pb-2.5 space-y-1">
                  <div className="rounded bg-slate-800 px-1 py-0.5">
                    <p className="text-[5px] text-slate-400">Total pay</p>
                    <p className="text-[8px] font-bold text-white leading-tight">SGD 1,300.00</p>
                  </div>
                  <div className="grid grid-cols-2 gap-0.5">
                    {["PayNow","Cards"].map(m => (
                      <div key={m} className="rounded bg-slate-700 py-0.5 text-center text-[5px] text-slate-300">{m}</div>
                    ))}
                  </div>
                  <div className="rounded bg-white p-1 flex items-center justify-center">
                    <div className="grid gap-[2px]" style={{ gridTemplateColumns: "repeat(5, 4px)" }}>
                      {Array.from({ length: 25 }, (_, i) => (
                        <div key={i} className={`h-[4px] w-[4px] rounded-[1px] ${Math.random() > 0.45 ? "bg-slate-900" : "bg-white"}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ③ Three feature cards */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
          {/* Card 1 — WhatsApp sharing */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-start gap-3 px-4 pt-4 pb-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-50">
                <MessageCircle className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-800 leading-snug">Share on WhatsApp &amp; messaging</p>
                <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">Send a link directly to customers — no app needed.</p>
              </div>
            </div>
            {/* Mini illustration */}
            <div className="mx-4 mb-3 flex-1 rounded-xl bg-green-50 px-3 py-3 flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded-full bg-green-400 shrink-0" />
                <div className="flex-1 rounded-full bg-green-200 px-2.5 py-1 text-[9px] text-green-800">Pay me for lunch 🍜 hitpay.me/ray</div>
              </div>
              <div className="flex items-center gap-2 flex-row-reverse">
                <div className="h-5 w-5 rounded-full bg-slate-300 shrink-0" />
                <div className="rounded-full bg-white border border-slate-200 px-2.5 py-1 text-[9px] text-slate-600">Sure! Paying now ✅</div>
              </div>
            </div>
            <div className="px-4 pb-4">
              <a href="#" className="text-[11px] font-medium text-blue-600 hover:underline">Learn More →</a>
            </div>
          </div>

          {/* Card 2 — Open amounts */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-start gap-3 px-4 pt-4 pb-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-800 leading-snug">Receive open amounts &amp; donations</p>
                <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">Let customers choose what they pay.</p>
              </div>
            </div>
            {/* Mini illustration */}
            <div className="mx-4 mb-3 flex-1 rounded-xl bg-blue-50 px-3 py-3 space-y-1.5">
              <p className="text-[9px] text-blue-500 font-medium">Enter amount</p>
              <div className="flex items-center gap-1.5 rounded-lg bg-white border border-blue-200 px-2.5 py-1.5">
                <span className="text-[9px] font-bold text-blue-600">SGD</span>
                <span className="text-[13px] font-bold text-slate-800 font-mono">50.00</span>
              </div>
              <div className="flex gap-1.5">
                {["$10","$25","$50"].map(a => (
                  <div key={a} className={`flex-1 rounded-md border py-0.5 text-center text-[8px] font-medium ${a === "$50" ? "border-blue-500 bg-blue-500 text-white" : "border-blue-200 text-blue-500"}`}>{a}</div>
                ))}
              </div>
            </div>
            <div className="px-4 pb-4">
              <a href="#" className="text-[11px] font-medium text-blue-600 hover:underline">Learn More →</a>
            </div>
          </div>

          {/* Card 3 — Collect emails */}
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-start gap-3 px-4 pt-4 pb-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-50">
                <Mail className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-800 leading-snug">Collect customer emails directly</p>
                <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">Build your list as you get paid.</p>
              </div>
            </div>
            {/* Mini illustration */}
            <div className="mx-4 mb-3 flex-1 rounded-xl bg-purple-50 px-3 py-3 space-y-1.5">
              <div className="rounded-lg bg-white border border-purple-200 px-2.5 py-1.5">
                <p className="text-[8px] text-slate-400">Email address</p>
                <p className="text-[9px] text-slate-700">jane@example.com</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm border-2 border-purple-400 flex items-center justify-center shrink-0">
                  <div className="h-1 w-1 rounded-[1px] bg-purple-500" />
                </div>
                <p className="text-[8px] text-slate-500">Send me order updates</p>
              </div>
              <div className="rounded-md bg-purple-500 py-1 text-center text-[8px] font-semibold text-white">
                Continue to payment
              </div>
            </div>
            <div className="px-4 pb-4">
              <a href="#" className="text-[11px] font-medium text-blue-600 hover:underline">Learn More →</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
