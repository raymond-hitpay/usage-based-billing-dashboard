"use client";

import * as React from "react";
import { MoreVertical, Plus } from "lucide-react";
import { CashPaymentUpsellModal } from "./cash-payment-upsell-modal";
import { SubscribeCashModal } from "./subscribe-cash-modal";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerEmail: string;
  amount: string;
  date: string;
  status: "Paid" | "Draft" | "Sent";
}

const MOCK_INVOICES: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-CMY2-20230829",
    customerEmail: "berry@bento.co.id",
    amount: "SGD 1,870.00",
    date: "Nov 23, 2023",
    status: "Paid",
  },
  {
    id: "2",
    invoiceNumber: "INV-CMY2-20230829",
    customerEmail: "berry@bento.co.id",
    amount: "SGD 1,870.00",
    date: "Nov 23, 2023",
    status: "Sent",
  },
  {
    id: "3",
    invoiceNumber: "INV-CMY2-20230829",
    customerEmail: "berry@bento.co.id",
    amount: "SGD 1,870.00",
    date: "Nov 23, 2023",
    status: "Draft",
  },
  {
    id: "4",
    invoiceNumber: "INV-CMY2-20230829",
    customerEmail: "berry@bento.co.id",
    amount: "SGD 1,870.00",
    date: "Nov 23, 2023",
    status: "Paid",
  },
  {
    id: "5",
    invoiceNumber: "INV-CMY2-20230829",
    customerEmail: "berry@bento.co.id",
    amount: "SGD 1,870.00",
    date: "Nov 23, 2023",
    status: "Sent",
  },
  {
    id: "6",
    invoiceNumber: "INV-CMY2-20230829",
    customerEmail: "berry@bento.co.id",
    amount: "SGD 1,870.00",
    date: "Nov 23, 2023",
    status: "Paid",
  },
];

function getStatusColor(status: string): string {
  switch (status) {
    case "Paid":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Sent":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Draft":
      return "bg-slate-50 text-slate-700 border-slate-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

export function InvoicingPage() {
  // Track free cash payments used (10 is the limit)
  const [cashPaymentsUsed, setCashPaymentsUsed] = React.useState(10);
  const [showUpsellModal, setShowUpsellModal] = React.useState(false);
  const [showSubscribeModal, setShowSubscribeModal] = React.useState(false);

  const handleAddPayment = () => {
    // Check if user has exceeded free limit
    if (cashPaymentsUsed >= 10) {
      setShowUpsellModal(true);
    } else {
      // In a real app, this would open a payment dialog
      setCashPaymentsUsed((prev) => prev + 1);
    }
  };

  const handleSubscribeClick = () => {
    setShowUpsellModal(false);
    setShowSubscribeModal(true);
  };

  const handleCloseSubscribe = () => {
    setShowSubscribeModal(false);
  };

  return (
    <div className="flex h-full flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-8 py-5">
        <h1 className="text-xl font-semibold text-slate-900">Invoices</h1>
        <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="h-4 w-4" />
          New Invoice
        </button>
      </div>

      {/* Stats */}
      <div className="border-b border-slate-100 px-8 py-4 grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-slate-50 border border-slate-100 p-4">
          <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider mb-1">
            Total invoiced
          </p>
          <p className="text-2xl font-bold text-slate-900">SGD 1170.00</p>
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-100 p-4">
          <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider mb-1">
            Amount received
          </p>
          <p className="text-2xl font-bold text-slate-900">SGD 1870.00</p>
        </div>
        <div className="rounded-lg bg-slate-50 border border-slate-100 p-4">
          <p className="text-xs text-slate-600 font-semibold uppercase tracking-wider mb-1">
            Pending invoices
          </p>
          <p className="text-2xl font-bold text-slate-900">0</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between border-b border-slate-100 px-8 py-4 gap-4">
        <div className="flex items-center gap-2">
          <button className="text-sm text-slate-600 hover:text-slate-900 font-medium">All</button>
          <button className="text-sm text-slate-400 hover:text-slate-600 font-medium">Sent</button>
          <button className="text-sm text-slate-400 hover:text-slate-600 font-medium">Overdue</button>
          <button className="text-sm text-slate-400 hover:text-slate-600 font-medium">Paid</button>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          {/* Search/filter icon placeholder */}
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 sticky top-0">
              <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Invoice Number
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-8 py-4"></th>
            </tr>
          </thead>
          <tbody>
            {MOCK_INVOICES.map((invoice) => (
              <tr key={invoice.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="px-8 py-4 text-sm font-medium text-slate-900">
                  {invoice.invoiceNumber}
                </td>
                <td className="px-8 py-4 text-sm text-slate-600">
                  {invoice.customerEmail}
                </td>
                <td className="px-8 py-4 text-sm text-slate-600">
                  {invoice.date}
                </td>
                <td className="px-8 py-4 text-sm font-medium text-slate-900">
                  {invoice.amount}
                </td>
                <td className="px-8 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold border ${getStatusColor(
                      invoice.status
                    )}`}
                  >
                    {invoice.status}
                  </span>
                </td>
                <td className="px-8 py-4 text-right">
                  <button
                    onClick={handleAddPayment}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm mr-2"
                  >
                    Add Payment
                  </button>
                  <button className="inline-flex items-center justify-center h-8 w-8 rounded hover:bg-slate-100 transition-colors">
                    <MoreVertical className="h-4 w-4 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      <CashPaymentUpsellModal
        isOpen={showUpsellModal}
        onClose={() => setShowUpsellModal(false)}
        onSubscribe={handleSubscribeClick}
        usedFreePayments={cashPaymentsUsed}
        freeLimit={10}
      />

      <SubscribeCashModal
        isOpen={showSubscribeModal}
        onClose={handleCloseSubscribe}
      />
    </div>
  );
}
