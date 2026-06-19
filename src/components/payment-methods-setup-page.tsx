"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ── Logo pill ───────────────────────────────────────────────────── */
function LogoPill({
  label,
  color = "bg-slate-100 text-slate-600",
}: {
  label: string;
  color?: string;
}) {
  return (
    <span className={cn("rounded px-2 py-0.5 text-[10px] font-bold", color)}>
      {label}
    </span>
  );
}

/* ── Status badge ────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: "active" | "pending" }) {
  return status === "active" ? (
    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-200">
      Active
    </span>
  ) : (
    <span className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-600 border border-amber-200">
      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
      </svg>
      Pending
    </span>
  );
}

/* ── Payment method row ──────────────────────────────────────────── */
interface PaymentMethodRowProps {
  logoLabel: string;
  logoBg?: string;
  logoTextColor?: string;
  name: string;
  subtitle?: string;
  status?: "active" | "pending";
  warning?: string;
  logos: { label: string; color: string }[];
  action: "manage" | "complete" | "turn-on";
  onTurnOn?: () => void;
}

function PaymentMethodRow({
  logoLabel,
  logoBg = "bg-slate-100",
  logoTextColor = "text-slate-700",
  name,
  subtitle,
  status,
  warning,
  logos,
  action,
  onTurnOn,
}: PaymentMethodRowProps) {
  const [enabled, setEnabled] = React.useState(false);

  const handleTurnOn = () => {
    setEnabled(true);
    onTurnOn?.();
  };

  return (
    <div className="flex items-center gap-5 rounded-xl border border-slate-200 bg-white px-5 py-4">
      {/* Brand logo box */}
      <div className={cn("flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-slate-200", logoBg)}>
        <span className={cn("text-xs font-bold", logoTextColor)}>{logoLabel}</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-900">{name}</span>
          {status && <StatusBadge status={status} />}
          {enabled && !status && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 border border-emerald-200">
              Active
            </span>
          )}
        </div>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {logos.map((l) => (
            <LogoPill key={l.label} label={l.label} color={l.color} />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-3">
        {warning && (
          <span className="text-sm font-medium text-amber-600">{warning}</span>
        )}
        {action === "manage" && (
          <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            Manage
          </button>
        )}
        {action === "complete" && (
          <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            Complete Now
          </button>
        )}
        {action === "turn-on" && !enabled && (
          <div className="flex items-center gap-2">
            <button className="text-sm text-slate-500 hover:text-slate-700 transition-colors">
              Learn more
            </button>
            <button
              onClick={handleTurnOn}
              className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              Turn On
            </button>
          </div>
        )}
        {action === "turn-on" && enabled && (
          <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            Manage
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Group section ───────────────────────────────────────────────── */
interface MethodGroup {
  id: string;
  title: string;
  methods: Omit<PaymentMethodRowProps, "onTurnOn">[];
}

const METHOD_GROUPS: MethodGroup[] = [
  {
    id: "local-qr",
    title: "Local QR",
    methods: [
      {
        logoLabel: "PAYNOW",
        logoBg: "bg-white",
        logoTextColor: "text-purple-700",
        name: "PayNow",
        subtitle: "Popular in Singapore",
        status: "active",
        logos: [
          { label: "DBS PayLah!", color: "bg-red-50 text-red-700" },
          { label: "Google Pay", color: "bg-slate-100 text-slate-700" },
          { label: "DBS", color: "bg-red-50 text-red-700" },
          { label: "UOB", color: "bg-blue-50 text-blue-800" },
          { label: "OCBC", color: "bg-red-50 text-red-600" },
          { label: "Citi", color: "bg-blue-50 text-blue-700" },
          { label: "PayNow", color: "bg-purple-50 text-purple-700" },
        ],
        action: "manage",
      },
    ],
  },
  {
    id: "cards",
    title: "Cards",
    methods: [
      {
        logoLabel: "CARD",
        logoBg: "bg-violet-50",
        logoTextColor: "text-violet-600",
        name: "Cards",
        status: "pending",
        warning: "Please provide additional information",
        logos: [
          { label: "VISA", color: "bg-blue-50 text-blue-700" },
          { label: "Mastercard", color: "bg-orange-50 text-orange-700" },
          { label: "JCB", color: "bg-blue-50 text-blue-800" },
          { label: "UnionPay", color: "bg-red-50 text-red-700" },
          { label: "Amex", color: "bg-blue-50 text-blue-900" },
        ],
        action: "complete",
      },
    ],
  },
  {
    id: "e-wallets",
    title: "E-wallets",
    methods: [
      {
        logoLabel: "Alipay+",
        logoBg: "bg-green-50",
        logoTextColor: "text-green-700",
        name: "AliPay+ and WeChat",
        logos: [
          { label: "Alipay+", color: "bg-green-50 text-green-700" },
          { label: "WeChat Pay", color: "bg-green-50 text-green-800" },
        ],
        action: "turn-on",
      },
      {
        logoLabel: "atome",
        logoBg: "bg-yellow-50",
        logoTextColor: "text-yellow-700",
        name: "Atome",
        logos: [{ label: "atome A", color: "bg-yellow-50 text-yellow-700" }],
        action: "turn-on",
      },
      {
        logoLabel: "GrabPay",
        logoBg: "bg-green-50",
        logoTextColor: "text-green-700",
        name: "GrabPay",
        logos: [
          { label: "GrabPay", color: "bg-green-50 text-green-700" },
          { label: "PayLater", color: "bg-green-50 text-green-700" },
          { label: "Grab", color: "bg-green-50 text-green-700" },
        ],
        action: "turn-on",
      },
      {
        logoLabel: "ShopeePay",
        logoBg: "bg-orange-50",
        logoTextColor: "text-orange-600",
        name: "ShopeePay / SPayLater",
        subtitle: "For Singapore customers",
        logos: [
          { label: "ShopeePay", color: "bg-orange-50 text-orange-600" },
          { label: "SPayLater", color: "bg-orange-50 text-orange-700" },
        ],
        action: "turn-on",
      },
      {
        logoLabel: "ShopBack",
        logoBg: "bg-slate-800",
        logoTextColor: "text-white",
        name: "ShopBack Pay",
        logos: [
          { label: "ShopBack", color: "bg-slate-100 text-slate-700" },
          { label: "ShopBack Pay", color: "bg-slate-100 text-slate-700" },
        ],
        action: "turn-on",
      },
    ],
  },
  {
    id: "crossborder",
    title: "Crossborder",
    methods: [
      {
        logoLabel: "DuitNow",
        logoBg: "bg-red-50",
        logoTextColor: "text-red-600",
        name: "DuitNow",
        subtitle: "Popular in Malaysia",
        logos: [{ label: "DuitNow", color: "bg-red-50 text-red-600" }],
        action: "turn-on",
      },
      {
        logoLabel: "FPX",
        logoBg: "bg-orange-50",
        logoTextColor: "text-orange-700",
        name: "FPX",
        subtitle: "Popular in Malaysia",
        logos: [{ label: "FPX", color: "bg-orange-50 text-orange-700" }],
        action: "turn-on",
      },
      {
        logoLabel: "GCash",
        logoBg: "bg-blue-50",
        logoTextColor: "text-blue-600",
        name: "GCash",
        subtitle: "Popular in Philippines",
        logos: [
          { label: "GCash", color: "bg-blue-50 text-blue-600" },
          { label: "GCash", color: "bg-blue-50 text-blue-600" },
        ],
        action: "turn-on",
      },
      {
        logoLabel: "billease",
        logoBg: "bg-white",
        logoTextColor: "text-blue-600",
        name: "Billease",
        subtitle: "Popular in Philippines",
        logos: [{ label: "billease", color: "bg-blue-50 text-blue-600" }],
        action: "turn-on",
      },
      {
        logoLabel: "LINE Pay",
        logoBg: "bg-green-50",
        logoTextColor: "text-green-700",
        name: "LINE Pay",
        logos: [{ label: "LINE Pay", color: "bg-green-50 text-green-700" }],
        action: "turn-on",
      },
      {
        logoLabel: "QRIS",
        logoBg: "bg-red-50",
        logoTextColor: "text-red-700",
        name: "QRIS",
        subtitle: "Popular in Indonesia",
        logos: [{ label: "QRIS", color: "bg-red-50 text-red-700" }],
        action: "turn-on",
      },
      {
        logoLabel: "QRPH",
        logoBg: "bg-blue-50",
        logoTextColor: "text-blue-700",
        name: "QRPH",
        subtitle: "Popular in Philippines",
        logos: [
          { label: "GCash", color: "bg-blue-50 text-blue-600" },
          { label: "Maya", color: "bg-green-50 text-green-700" },
          { label: "BDO", color: "bg-blue-50 text-blue-800" },
          { label: "BPI", color: "bg-red-50 text-red-700" },
          { label: "SQRPH", color: "bg-blue-50 text-blue-700" },
        ],
        action: "turn-on",
      },
      {
        logoLabel: "JP",
        logoBg: "bg-red-50",
        logoTextColor: "text-red-700",
        name: "Japanese E-Wallets",
        logos: [
          { label: "au PAY", color: "bg-orange-50 text-orange-700" },
          { label: "d払い", color: "bg-red-50 text-red-700" },
          { label: "PayPay", color: "bg-red-50 text-red-600" },
          { label: "J Pay", color: "bg-blue-50 text-blue-700" },
        ],
        action: "turn-on",
      },
      {
        logoLabel: "KR",
        logoBg: "bg-slate-50",
        logoTextColor: "text-slate-700",
        name: "Korean Payment Methods",
        logos: [
          { label: "•Pay", color: "bg-slate-100 text-slate-700" },
          { label: "N Pay", color: "bg-green-50 text-green-700" },
          { label: "PAYCO", color: "bg-red-50 text-red-700" },
        ],
        action: "turn-on",
      },
    ],
  },
];

/* ── Page ────────────────────────────────────────────────────────── */
interface PaymentMethodsSetupPageProps {
  onClose: () => void;
  scrollTo?: string;
  onTurnOn?: (groupId: string) => void;
}

export function PaymentMethodsSetupPage({ onClose, scrollTo, onTurnOn }: PaymentMethodsSetupPageProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Scroll to anchor after mount
  React.useEffect(() => {
    if (!scrollTo) return;
    const el = document.getElementById(scrollTo);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [scrollTo]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* Top bar */}
      <div className="flex items-center border-b border-slate-200 px-6 py-3.5">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
        >
          Close
          <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
            esc
          </kbd>
        </button>
      </div>

      {/* Content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold text-slate-900">Add your payment methods</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Select providers how you can collect payment from customers
          </p>

          <div className="mt-8 flex flex-col gap-8">
            {METHOD_GROUPS.map((group) => (
              <div key={group.id}>
                {/* Group header with anchor */}
                <h2
                  id={group.id}
                  className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400 scroll-mt-6"
                >
                  {group.title}
                </h2>
                <div className="flex flex-col gap-3">
                  {group.methods.map((method) => (
                    <PaymentMethodRow
                      key={method.name}
                      {...method}
                      onTurnOn={
                        method.action === "turn-on"
                          ? () => onTurnOn?.(group.id)
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
