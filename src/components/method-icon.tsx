import * as React from "react";
import type { PaymentMethod } from "@/lib/mock-data";

function VisaLogo() {
  return (
    <span className="flex h-5 w-8 items-center justify-center rounded-[3px] bg-[#1A1F71] text-[8px] font-extrabold italic tracking-tight text-white">
      VISA
    </span>
  );
}

function MastercardLogo() {
  return (
    <span className="relative inline-flex h-5 w-8 items-center justify-center rounded-[3px] bg-white">
      <span className="absolute left-1.5 h-3.5 w-3.5 rounded-full bg-[#EB001B]" />
      <span className="absolute right-1.5 h-3.5 w-3.5 rounded-full bg-[#F79E1B] mix-blend-multiply" />
    </span>
  );
}

function PayNowLogo() {
  return (
    <span className="flex h-5 w-8 items-center justify-center rounded-[3px] bg-[#7B2CBF] text-[7px] font-bold leading-none text-white">
      PAY
      <br />
      NOW
    </span>
  );
}

function CashIcon() {
  return (
    <span className="flex h-5 w-8 items-center justify-center rounded-[3px] bg-emerald-100 text-emerald-600">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3 w-3"
      >
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="12" cy="12" r="2" />
      </svg>
    </span>
  );
}

interface MethodIconProps {
  method: PaymentMethod;
  cardLast4?: string;
}

export function MethodIcon({ method, cardLast4 }: MethodIconProps) {
  if (method === "visa") {
    return (
      <div className="flex items-center gap-2">
        <VisaLogo />
        <span className="text-sm text-slate-600">•••• {cardLast4}</span>
      </div>
    );
  }
  if (method === "mastercard") {
    return (
      <div className="flex items-center gap-2">
        <MastercardLogo />
        <span className="text-sm text-slate-600">•••• {cardLast4}</span>
      </div>
    );
  }
  if (method === "paynow") {
    return (
      <div className="flex items-center gap-2">
        <PayNowLogo />
        <span className="text-sm text-slate-700">PayNow</span>
      </div>
    );
  }
  if (method === "paynow_transfer") {
    return (
      <div className="flex items-center gap-2">
        <PayNowLogo />
        <span className="text-sm text-slate-700">PayNow Transfer</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <CashIcon />
      <span className="text-sm text-slate-700">Cash</span>
    </div>
  );
}
