"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function SelectField({
  label,
  required,
  defaultValue,
  options,
  placeholder,
}: {
  label: string;
  required?: boolean;
  defaultValue?: string;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <div className="relative">
        <select
          defaultValue={defaultValue ?? ""}
          className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

function TextField({
  label,
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <input
        type="text"
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
    </div>
  );
}

interface BankAccountsPageProps {
  onClose?: () => void;
  onSave?: () => void;
}

export function BankAccountsPage({ onClose, onSave }: BankAccountsPageProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          Close
          <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
            esc
          </kbd>
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => { onSave?.(); onClose?.(); }}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
          >
            Save
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-8 py-10">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-2xl font-bold text-slate-900">Add New Bank Account</h1>

          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5">
            <SelectField
              label="Country"
              required
              defaultValue="Singapore"
              options={["Singapore", "Malaysia", "Indonesia", "Thailand", "Philippines"]}
            />
            <SelectField
              label="Transfer Method"
              required
              defaultValue="Bank Transfer"
              options={["Bank Transfer", "PayNow", "PayLah"]}
            />
            <SelectField
              label="Transfer Type"
              defaultValue="FAST"
              options={["FAST", "GIRO", "SWIFT"]}
            />
            <SelectField
              label="Currency"
              required
              placeholder="Select one"
              options={["SGD", "USD", "MYR", "IDR", "THB"]}
            />
            <SelectField
              label="Entity Type"
              required
              placeholder=""
              options={["Individual", "Business"]}
            />
            <TextField
              label="Account Holder Name"
              required
              placeholder="John Doe"
            />
          </div>

          {/* Checkbox */}
          <div className="mt-6 flex items-center gap-2.5">
            <input
              id="use-in-hitpay"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="use-in-hitpay" className="text-sm text-slate-700">
              Use in HitPay
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
