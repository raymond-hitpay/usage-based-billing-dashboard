"use client";

import * as React from "react";
import { ArrowRight, X, Layers, ChevronLeft, ChevronRight, Link2, FileText, QrCode, Tablet, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { type SetupGuideVariant, type SetupGroup, countRemaining } from "@/lib/setup-guide-data";
import { SetupGuideInline } from "./setup-guide-inline";

interface OverviewPageProps {
  variant: SetupGuideVariant;
  onVariantChange: (v: SetupGuideVariant) => void;
  onOpenSetupGuide: () => void;
  onNavigate: (page: string) => void;
  setupGroups: SetupGroup[];
}

/* ── Card illustrations ──────────────────────────────────────────── */
function IllustrationPaymentLink() {
  return (
    <div className="flex items-end justify-center gap-3 h-full pt-2">
      <div className="mb-4 flex flex-col gap-1.5">
        <div className="rounded-2xl rounded-bl-sm bg-slate-100 px-2.5 py-1.5 text-[9px] text-slate-500 max-w-[100px]">
          Can you send the payment link?
        </div>
        <div className="self-end rounded-2xl rounded-br-sm bg-blue-600 px-2.5 py-1.5 text-[9px] text-white max-w-[100px]">
          Sure! Here it is 👇
        </div>
      </div>
      <div className="relative w-[62px] h-[112px] rounded-[12px] bg-slate-900 ring-2 ring-slate-700 overflow-hidden shrink-0">
        <div className="absolute top-1 left-1/2 -translate-x-1/2 h-1 w-6 rounded-full bg-slate-700" />
        <div className="mt-3.5 px-1.5 space-y-1">
          <div className="rounded bg-blue-600 px-1 py-0.5 text-center">
            <p className="text-[6px] text-blue-100">You're paying</p>
            <p className="text-[8px] font-bold text-white">SGD 100.00</p>
          </div>
          <div className="rounded bg-slate-800 px-1 py-0.5">
            <p className="text-[5px] text-slate-400 mb-0.5">Method</p>
            <div className="flex gap-0.5 flex-wrap">
              {["Visa","PayNow","GrabPay"].map(m => (
                <span key={m} className="rounded bg-slate-700 px-0.5 text-[4.5px] text-slate-300">{m}</span>
              ))}
            </div>
          </div>
          <div className="rounded bg-blue-600 py-0.5 text-center">
            <p className="text-[6px] font-semibold text-white">Pay now</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function IllustrationInvoice() {
  return (
    <div className="flex justify-center items-end h-full pt-2">
      <div className="w-full max-w-[200px] rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden text-[8px]">
        <div className="border-b border-slate-100 bg-slate-50 px-2.5 py-1.5 flex justify-between">
          <div>
            <p className="text-[6px] text-slate-400">Invoice Amount</p>
            <p className="font-bold text-slate-800 text-[8px]">SGD 11,170.88</p>
          </div>
          <div>
            <p className="text-[6px] text-slate-400">Due date</p>
            <p className="font-bold text-slate-800 text-[8px]">Nov 27, 2024</p>
          </div>
        </div>
        <div className="px-2.5 py-1.5 space-y-1">
          <p className="text-[6px] text-slate-400">INV-0128HYY · Acme Corp</p>
          {[["Premium house cleaning","SGD 100"],["Kitchen light clean","SGD 50"]].map(([n,v]) => (
            <div key={n} className="flex justify-between">
              <span className="text-slate-500 truncate max-w-[110px]">{n}</span>
              <span className="text-slate-800 font-medium">{v}</span>
            </div>
          ))}
          <div className="flex justify-end border-t border-slate-100 pt-1">
            <span className="font-bold text-slate-900">SGD 300.00</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function IllustrationQR() {
  const cells = Array.from({ length: 7 }, (_, r) =>
    Array.from({ length: 7 }, (_, c) => {
      const corner =
        (r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2);
      const edge =
        (r === 0 || r === 6 || c === 0 || c === 6) && (r < 3 || c < 3 || (r > 3 && c < 3));
      return corner || (Math.random() > 0.45 && !edge);
    })
  );
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 pt-2">
      <div className="rounded-xl border-2 border-slate-200 p-3 bg-white shadow-sm">
        <div className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(9,10px)" }}>
          {Array.from({ length: 9 }, (_, r) =>
            Array.from({ length: 9 }, (_, c) => {
              const inCorner = (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
              const cornerBorder =
                (r === 0 || r === 2) && (c < 3 || c > 5 || (r > 5)) ||
                (c === 0 || c === 2) && r < 3;
              const filled = inCorner
                ? !(r === 1 && c === 1) && !(r === 1 && c === 7) && !(r === 7 && c === 1)
                : Math.random() > 0.5;
              return (
                <div
                  key={`${r}-${c}`}
                  className={cn("h-[10px] w-[10px] rounded-[2px]", filled ? "bg-slate-900" : "bg-white")}
                />
              );
            })
          )}
        </div>
      </div>
      <p className="text-[10px] text-slate-400">HitPay · My Cat Shop</p>
    </div>
  );
}

function IllustrationPOS() {
  return (
    <div className="flex items-end justify-center gap-3 h-full pt-2">
      {/* Tablet */}
      <div className="w-[100px] h-[75px] rounded-lg border-2 border-slate-300 bg-white shadow-sm overflow-hidden">
        <div className="bg-slate-800 px-2 py-1">
          <p className="text-[6px] font-semibold text-white">Online Store</p>
        </div>
        <div className="p-1.5 grid grid-cols-2 gap-1">
          {["Item A","Item B","Item C","Item D"].map(i => (
            <div key={i} className="rounded bg-slate-100 px-1 py-0.5 text-center">
              <p className="text-[5px] text-slate-500">{i}</p>
              <p className="text-[6px] font-bold text-slate-800">$10</p>
            </div>
          ))}
        </div>
      </div>
      {/* Terminal */}
      <div className="w-[52px] h-[80px] rounded-lg border-2 border-slate-300 bg-white shadow-sm overflow-hidden shrink-0">
        <div className="bg-blue-600 px-1 py-1 text-center">
          <p className="text-[6px] font-semibold text-white">POS</p>
        </div>
        <div className="p-1 space-y-0.5">
          <div className="rounded bg-slate-100 py-0.5 text-center">
            <p className="text-[5.5px] font-bold text-slate-700">SGD 48.00</p>
          </div>
          <div className="grid grid-cols-3 gap-0.5">
            {["1","2","3","4","5","6","7","8","9"].map(n => (
              <div key={n} className="rounded bg-slate-50 text-center py-0.5">
                <p className="text-[5px] text-slate-600">{n}</p>
              </div>
            ))}
          </div>
          <div className="rounded bg-blue-600 py-0.5 text-center">
            <p className="text-[5.5px] font-semibold text-white">Charge</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function IllustrationSendMoney() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 pt-2">
      <div className="w-full max-w-[200px] rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 px-3 py-2 flex items-center justify-between">
          <span className="text-[8px] font-semibold text-slate-700">Send Money</span>
          <span className="text-[7px] text-slate-400">Instant transfer</span>
        </div>
        <div className="px-3 py-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-[7px] font-bold text-blue-700">J</div>
              <div>
                <p className="text-[7px] font-medium text-slate-800">John Doe</p>
                <p className="text-[6px] text-slate-400">DBS · ••••4821</p>
              </div>
            </div>
            <p className="text-[9px] font-bold text-slate-900">SGD 500</p>
          </div>
          <div className="h-px bg-slate-100" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-full bg-violet-100 flex items-center justify-center text-[7px] font-bold text-violet-700">S</div>
              <div>
                <p className="text-[7px] font-medium text-slate-800">Sarah Tan</p>
                <p className="text-[6px] text-slate-400">OCBC · ••••2233</p>
              </div>
            </div>
            <p className="text-[9px] font-bold text-slate-900">SGD 250</p>
          </div>
          <div className="rounded bg-blue-600 py-1 text-center mt-1">
            <p className="text-[7px] font-semibold text-white">Confirm Transfer</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Feature carousel ────────────────────────────────────────────── */

const TAG_STYLES: Record<string, string> = {
  Payments: "bg-blue-50 text-blue-700 border-blue-200",
  Commerce: "bg-amber-50 text-amber-700 border-amber-200",
  Finance:  "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const FEATURE_CARDS = [
  {
    id: "payment-links",
    tag: "Payments",
    title: "Create Payment Links",
    subtitle: "Share a link and get paid instantly — no website or app needed. Works via WhatsApp, email, or SMS.",
    navigatesTo: "Payment Links",
    Illustration: IllustrationPaymentLink,
  },
  {
    id: "invoices",
    tag: "Payments",
    title: "Professional Invoicing",
    subtitle: "Send branded invoices with online payment options. Auto-reminders help you get paid faster.",
    navigatesTo: "All Invoices",
    Illustration: IllustrationInvoice,
  },
  {
    id: "static-qr",
    tag: "Payments",
    title: "Static QR Payments",
    subtitle: "Print a QR code and place it anywhere. Customers scan and pay via PayNow or other methods.",
    navigatesTo: "Static QRs",
    Illustration: IllustrationQR,
  },
  {
    id: "pos",
    tag: "Commerce",
    title: "POS & Online Store Builder",
    subtitle: "Turn any device into a point-of-sale terminal, or launch a full online storefront in minutes.",
    navigatesTo: "Web POS",
    Illustration: IllustrationPOS,
  },
  {
    id: "send-money",
    tag: "Finance",
    title: "Send Money",
    subtitle: "Pay vendors, suppliers and staff directly from your HitPay balance with instant bank transfers.",
    navigatesTo: "Beneficiaries",
    Illustration: IllustrationSendMoney,
  },
];

function FeatureCarousel({ onNavigate }: { onNavigate: (p: string) => void }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [dismissed, setDismissed] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "right" ? 420 : -420, behavior: "smooth" });
  };

  // Auto-scroll every 3 seconds, loop back to start at the end
  React.useEffect(() => {
    if (isPaused) return;
    const el = scrollRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 1) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 416, behavior: "smooth" });
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isPaused]);

  if (dismissed) return null;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header row */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Explore HitPay
        </h2>
        <div className="flex items-center gap-1">
          <button
            onClick={() => scroll("left")}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600 transition-colors ml-1"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-1 scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        {FEATURE_CARDS.map((card) => {
          const { Illustration } = card;
          return (
            <button
              key={card.id}
              onClick={() => onNavigate(card.navigatesTo)}
              className="flex-none w-[400px] rounded-xl border border-slate-200 bg-white overflow-hidden hover:border-slate-300 hover:shadow-md transition-all flex flex-row text-left cursor-pointer"
            >
              {/* Left: text */}
              <div className="flex flex-col justify-between px-6 py-5 flex-1 min-w-0">
                <div>
                  <span className={cn(
                    "inline-block rounded-full border px-2.5 py-0.5 text-[10px] font-semibold mb-3",
                    TAG_STYLES[card.tag] ?? "bg-slate-50 text-slate-600 border-slate-200"
                  )}>
                    {card.tag}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>
                <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors self-start">
                  Learn more <ArrowRight className="h-3 w-3" />
                </span>
              </div>

              {/* Right: illustration */}
              <div className="w-[160px] shrink-0 bg-slate-50 border-l border-slate-100 overflow-hidden flex items-end justify-center p-3">
                <Illustration />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Period toggle (pill style matching screenshots) ─────────────── */
function PeriodToggle({
  value,
  onChange,
}: {
  value: "7d" | "30d";
  onChange: (v: "7d" | "30d") => void;
}) {
  return (
    <div className="flex items-center rounded-full bg-slate-100 p-0.5 text-sm font-medium">
      {(["7d", "30d"] as const).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={cn(
            "rounded-full px-4 py-1 transition-all",
            value === p
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          )}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

/* ── Your Sales — bar chart ──────────────────────────────────────── */
function YourSales() {
  const [period, setPeriod] = React.useState<"7d" | "30d">("30d");

  // Generate date labels for x-axis
  const labels30d = ["06 MAY","09 MAY","12 MAY","15 MAY","18 MAY","21 MAY","24 MAY","27 MAY","30 MAY","02 JUN"];
  const labels7d  = ["29 MAY","30 MAY","31 MAY","01 JUN","02 JUN","03 JUN","04 JUN"];
  const labels = period === "30d" ? labels30d : labels7d;
  const yLabels = ["0.0K","0.0K","0.0K","0.0K","0.0K","0"];

  return (
    <div className="flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Your Sales</h2>
        <PeriodToggle value={period} onChange={setPeriod} />
      </div>

      <div className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 pt-5 pb-4">
        <div className="flex gap-2">
          {/* Y-axis */}
          <div className="flex w-10 shrink-0 flex-col justify-between text-right text-xs text-slate-400 pb-6">
            {yLabels.map((v, i) => <span key={i}>{v}</span>)}
          </div>

          {/* Chart area */}
          <div className="flex flex-1 flex-col">
            {/* Bars */}
            <div className="relative flex flex-1 items-end gap-1 border-b border-l border-slate-100 pb-0" style={{ height: 180 }}>
              {/* Horizontal grid lines */}
              {[0,20,40,60,80].map(pct => (
                <div
                  key={pct}
                  className="pointer-events-none absolute w-full border-t border-slate-100"
                  style={{ bottom: `${pct}%` }}
                />
              ))}
              {labels.map((label) => (
                <div
                  key={label}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div
                    className="w-full rounded-t-md bg-indigo-100"
                    style={{ height: "92%" }}
                  />
                </div>
              ))}
            </div>

            {/* X-axis labels */}
            <div className="mt-2 flex gap-1">
              {labels.map((label) => (
                <div key={label} className="flex-1 text-center text-[9px] text-slate-400 leading-tight">
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Sales by Payment Method — donut chart ───────────────────────── */
function SalesByPaymentMethod({ onNavigate }: { onNavigate: (p: string) => void }) {
  const [period, setPeriod] = React.useState<"7d" | "30d">("30d");

  // SVG donut: cx=cy=100, r=70, strokeWidth=28 → empty state = full gray ring
  const r = 70;
  const cx = 100;
  const cy = 100;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Sales by Payment Method</h2>
        <PeriodToggle value={period} onChange={setPeriod} />
      </div>

      <div className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-8 flex flex-col items-center justify-center gap-5">
        {/* Donut SVG */}
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Track */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={28}
          />
          {/* Empty arc — shown as full gray ring */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke="#d1d5db"
            strokeWidth={28}
            strokeDasharray={circumference}
            strokeDashoffset={0}
            strokeLinecap="butt"
            transform={`rotate(-90 ${cx} ${cy})`}
          />
          {/* Center text */}
          <text x={cx} y={cy - 10} textAnchor="middle" className="text-xs" fill="#94a3b8" fontSize={12}>
            Total
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" fill="#1e293b" fontSize={15} fontWeight="600" fontFamily="monospace">
            SGD 0.00
          </text>
        </svg>

        {/* CTA */}
        <button
          onClick={() => onNavigate("Payment Methods")}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
        >
          Discover more methods <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────── */
export function OverviewPage({
  variant,
  onVariantChange,
  onOpenSetupGuide,
  onNavigate,
  setupGroups,
}: OverviewPageProps) {
  const remaining = countRemaining(setupGroups);

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-white">
      {/* Page header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-7 py-4">
        <h1 className="text-xl font-semibold text-slate-900">Overview</h1>
        {/* Prototype toggle */}
        <div className="flex items-center gap-2">
          <Layers className="h-3.5 w-3.5 text-slate-300" />
          <span className="text-xs text-slate-400 mr-0.5">Prototype:</span>
          <div className="flex rounded-md border border-slate-200 overflow-hidden text-xs font-medium">
            <button
              onClick={() => onVariantChange("floating")}
              className={cn(
                "px-3 py-1.5 transition-colors",
                variant === "floating" ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50"
              )}
            >
              Floating
            </button>
            <button
              onClick={() => onVariantChange("panel")}
              className={cn(
                "px-3 py-1.5 border-l border-slate-200 transition-colors",
                variant === "panel" ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50"
              )}
            >
              Side Panel
            </button>
            <button
              onClick={() => onVariantChange("inline")}
              className={cn(
                "px-3 py-1.5 border-l border-slate-200 transition-colors",
                variant === "inline" ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50"
              )}
            >
              Inline
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 px-7 py-5 space-y-5">
        {/* ── Inline Setup Guide (variant C) ── */}
        {variant === "inline" && (
          <SetupGuideInline groups={setupGroups} onNavigate={onNavigate} />
        )}
        {/* ── Notification Banner (panel only) ── */}
        {variant === "panel" && <div className="relative overflow-hidden rounded-xl bg-slate-100 px-7 py-6">
          {/* Decorative right-side graphic */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-0 h-full w-72"
            viewBox="0 0 288 120"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Dot grid pattern */}
              <pattern id="banner-dots" x="0" y="0" width="18" height="18" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.4" fill="#6366f1" fillOpacity="0.22" />
              </pattern>
              {/* Left-edge fade so dots don't clash with text */}
              <linearGradient id="banner-fade" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f1f5f9" stopOpacity="1" />
                <stop offset="45%" stopColor="#f1f5f9" stopOpacity="0" />
              </linearGradient>
              {/* Radial glow behind globe rings */}
              <radialGradient id="banner-glow" cx="75%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Dot fill */}
            <rect width="288" height="120" fill="url(#banner-dots)" />

            {/* Soft radial glow */}
            <rect width="288" height="120" fill="url(#banner-glow)" />

            {/* Concentric globe rings centred off the right edge */}
            {[28, 52, 76, 100, 126, 154].map((r, i) => (
              <circle
                key={r}
                cx="252"
                cy="60"
                r={r}
                fill="none"
                stroke="#6366f1"
                strokeWidth="0.8"
                strokeOpacity={0.28 - i * 0.03}
              />
            ))}

            {/* Vertical "meridian" arcs */}
            {[-30, 0, 30].map((offset) => (
              <ellipse
                key={offset}
                cx={252 + offset}
                cy="60"
                rx={Math.abs(offset) + 18}
                ry="60"
                fill="none"
                stroke="#6366f1"
                strokeWidth="0.6"
                strokeOpacity="0.15"
              />
            ))}

            {/* Left fade overlay */}
            <rect width="288" height="120" fill="url(#banner-fade)" />
          </svg>

          <div>
            <p className="text-lg font-bold text-slate-900">We just need a few more details from you</p>
            <p className="mt-1 text-sm text-slate-500">
              Complete these tasks to unlock the full potential of your HitPay account.
              {remaining > 0 && <> <span className="font-medium text-slate-700">{remaining} step{remaining !== 1 ? "s" : ""} remaining.</span></>}
            </p>
            <button
              onClick={onOpenSetupGuide}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              See pending tasks <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>}

        {/* ── Feature Carousel ── */}
        <FeatureCarousel onNavigate={onNavigate} />

        {/* ── Sales summary cards ── */}
        <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
          Quick Insights
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Sales this month", badge: { label: "100%", down: true } },
            { label: "Sales this week" },
            { label: "Sales today" },
            { label: "Wallet balance" },
          ].map(({ label, badge }) => (
            <div key={label} className="rounded-xl border border-slate-200 bg-white px-5 py-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm text-slate-500">{label}</p>
                {badge && (
                  <span className="flex items-center gap-0.5 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                    ▼ {badge.label}
                  </span>
                )}
              </div>
              <p className="mt-3 font-mono text-xl font-semibold text-slate-900">SGD 0.00</p>
            </div>
          ))}
        </div>
        </div>

        {/* ── Bottom grid: Your Sales + Sales by Payment Method ── */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <YourSales />
          <SalesByPaymentMethod onNavigate={onNavigate} />
        </div>

        {/* ── Recent Transactions + Recent Payouts ── */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* Recent Transactions */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Transactions</h2>
            <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Payment Method</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3} className="px-5 py-12 text-center text-sm text-slate-400">
                    No transactions yet
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Payouts */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Payouts</h2>
            <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Initiate Date</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">Amount</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3} className="px-5 py-12 text-center text-sm text-slate-400">
                    No payouts yet
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        </div>{/* end grid */}
      </div>
    </div>
  );
}
