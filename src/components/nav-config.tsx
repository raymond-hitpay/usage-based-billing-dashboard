"use client";

import * as React from "react";
import {
  LayoutGrid,
  ArrowLeftRight,
  FileBarChart,
  Users,
  Package,
  Tag,
  Image as ImageIcon,
  Calendar,
  Truck,
  Ticket,
  MapPin,
  Tablet,
  Link2,
  QrCode,
  FileText,
  RefreshCw,
  Code2,
  Plug,
  CreditCard,
  Settings as SettingsIcon,
  ChevronRight,
  BadgeCheck,
  History,
  Handshake,
  Receipt,
  Send,
  Landmark,
  ClipboardList,
  Building2,
  UserCircle,
  Percent,
  Palette,
  Globe,
  Bell,
  Mail,
  Wallet,
  Banknote,
  ReceiptText,
  Scale,
  TrendingUp,
  ScrollText,
  Calculator,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type TabId = "payments" | "commerce" | "finance";
export type SubView = "settings" | null;

export interface NavSubItem {
  label: string;
  active?: boolean;
}

export interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  children?: NavSubItem[];
  navigatesTo?: "settings";
  badge?: string;
}

export interface NavSection {
  heading?: string;
  items: NavItem[];
}

export const tabsMeta: {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  activeTile: string;
  activeText: string;
  inactiveHover: string;
}[] = [
  {
    id: "payments",
    label: "Payments",
    icon: CreditCard,
    iconClass: "text-blue-600",
    activeTile: "bg-blue-50 ring-1 ring-blue-100",
    activeText: "text-blue-700",
    inactiveHover: "hover:bg-blue-50/50 hover:text-blue-600",
  },
  {
    id: "commerce",
    label: "Commerce",
    icon: ShoppingBag,
    iconClass: "text-amber-600",
    activeTile: "bg-amber-50 ring-1 ring-amber-100",
    activeText: "text-amber-700",
    inactiveHover: "hover:bg-amber-50/50 hover:text-amber-600",
  },
  {
    id: "finance",
    label: "Finance",
    icon: Wallet,
    iconClass: "text-emerald-600",
    activeTile: "bg-emerald-50 ring-1 ring-emerald-100",
    activeText: "text-emerald-700",
    inactiveHover: "hover:bg-emerald-50/50 hover:text-emerald-600",
  },
];

export const tabDefaults: Record<TabId, string> = {
  payments: "Overview",
  commerce: "Web POS",
  finance: "Overview",
};

export const settingsDefaultByTab: Partial<Record<TabId, string>> = {
  payments: "Business Details",
  commerce: "General Settings",
};

export const sectionsByTab: Record<TabId, NavSection[]> = {
  payments: [
    {
      items: [
        { label: "Overview", icon: LayoutGrid },
        { label: "Transactions", icon: ArrowLeftRight },
        { label: "Reports", icon: FileBarChart },
        {
          label: "Payouts & Balances",
          icon: Landmark,
          children: [{ label: "Payouts" }, { label: "Wallet Balances" }],
        },
        { label: "Customers", icon: Users },
      ],
    },
    {
      heading: "NO-CODE TOOLS",
      items: [
        { label: "Payment Links", icon: Link2 },
        { label: "Static QRs", icon: QrCode },
        {
          label: "Invoicing",
          icon: FileText,
          children: [
            { label: "All Invoices" },
            { label: "Repeating" },
            { label: "Products" },
            { label: "Settings" },
          ],
        },
        {
          label: "Recurring Billing",
          icon: RefreshCw,
          children: [{ label: "Plans" }, { label: "Subscriptions" }],
        },
      ],
    },
    {
      heading: "OTHERS",
      items: [
        { label: "Developers", icon: Code2 },
        { label: "Integrations", icon: Plug },
        { label: "Payment Methods", icon: CreditCard },
        { label: "Settings", icon: SettingsIcon, navigatesTo: "settings" },
      ],
    },
  ],
  commerce: [
    {
      items: [
        { label: "Web POS", icon: Tablet },
        { label: "Orders", icon: ClipboardList },
        { label: "Products", icon: Package },
        { label: "Customers", icon: Users },
        { label: "Reports", icon: FileBarChart },
      ],
    },
    {
      heading: "MARKETING",
      items: [
        { label: "Discounts", icon: Percent },
        { label: "Coupons", icon: Ticket },
      ],
    },
    {
      heading: "POINT OF SALE",
      items: [
        { label: "Card Terminals", icon: CreditCard },
        { label: "Mall GTO Integration", icon: Building2 },
      ],
    },
    {
      heading: "ONLINE STORE",
      items: [
        { label: "Store Design", icon: Palette },
        { label: "Pages", icon: FileText },
        { label: "Media", icon: ImageIcon },
        { label: "Booking", icon: Calendar },
        { label: "Domain", icon: Globe },
        { label: "Shipping & Pickup", icon: Truck },
      ],
    },
    {
      items: [{ label: "Locations", icon: MapPin }],
    },
    {
      heading: "OTHERS",
      items: [
        { label: "Settings", icon: SettingsIcon, navigatesTo: "settings" },
      ],
    },
  ],
  finance: [
    {
      items: [
        { label: "Overview", icon: LayoutGrid },
        { label: "Cash Flow", icon: TrendingUp },
      ],
    },
    {
      heading: "TOOLS",
      items: [
        {
          label: "Bill Pay",
          icon: Receipt,
          children: [
            { label: "Bills" },
            { label: "Vendors" },
            { label: "Approvals" },
          ],
        },
        {
          label: "Send Money",
          icon: Send,
          children: [
            { label: "Beneficiaries" },
            { label: "Transfer History" },
          ],
        },
        { label: "Employee Spend", icon: Wallet },
        { label: "Payroll", icon: Banknote },
        { label: "Chargebacks & Disputes", icon: ShieldAlert },
        { label: "Approval Rules", icon: ShieldCheck },
      ],
    },
    {
      heading: "ACCOUNTING",
      items: [
        { label: "Fee Invoice", icon: ReceiptText },
        { label: "Reconciliation", icon: Scale },
        { label: "Statements", icon: ScrollText },
        { label: "Tax Reports", icon: Calculator },
        { label: "Accounting Sync", icon: Plug },
      ],
    },
    {
      heading: "OTHERS",
      items: [
        { label: "Settings", icon: SettingsIcon, navigatesTo: "settings" },
      ],
    },
  ],
};

const settingsSections: NavSection[] = [
  {
    heading: "ACCOUNT",
    items: [
      { label: "Business Details", icon: Building2 },
      { label: "Account Verification", icon: BadgeCheck },
      { label: "Bank Accounts", icon: Landmark },
    ],
  },
  {
    heading: "TEAM",
    items: [
      { label: "Staff", icon: UserCircle },
      { label: "Audit Logs", icon: History },
    ],
  },
  {
    heading: "BRANDING",
    items: [
      { label: "Checkout Customisation", icon: Palette },
      { label: "Notifications", icon: Bell },
      { label: "Email Templates", icon: Mail },
    ],
  },
  {
    heading: "PARTNERS",
    items: [
      { label: "Partners", icon: Handshake },
      { label: "Platform", icon: Globe },
    ],
  },
];

const commerceSettingsSections: NavSection[] = [
  {
    heading: "STOREFRONT",
    items: [
      { label: "General Settings", icon: SettingsIcon },
      { label: "SEO", icon: Globe },
      { label: "Tracking Tools", icon: FileBarChart },
      { label: "Multi-currency", icon: Banknote },
    ],
  },
  {
    heading: "CUSTOMISATION",
    items: [
      { label: "Order Form", icon: FileText },
      { label: "Button Labels", icon: Tag },
    ],
  },
  {
    heading: "TAX & FEES",
    items: [
      { label: "Tax Settings", icon: Landmark },
      { label: "Surcharges", icon: Percent },
    ],
  },
  {
    heading: "COMMUNICATION",
    items: [
      { label: "Notifications", icon: Bell },
      { label: "Email Templates", icon: Mail },
    ],
  },
  {
    heading: "TEAM",
    items: [{ label: "Staff", icon: UserCircle }],
  },
  {
    heading: "BUSINESS",
    items: [
      { label: "Business Details", icon: Building2 },
      { label: "Payment Methods", icon: CreditCard },
    ],
  },
];

export const settingsByTab: Partial<Record<TabId, NavSection[]>> = {
  payments: settingsSections,
  commerce: commerceSettingsSections,
};

export function resolveSections(activeTab: TabId, subView: SubView): NavSection[] {
  if (subView === "settings") {
    return settingsByTab[activeTab] ?? settingsSections;
  }
  return sectionsByTab[activeTab];
}

function computeInitialOpen(
  sections: NavSection[],
  selectedPage: string
): Set<string> {
  const open = new Set<string>();
  for (const section of sections) {
    for (const item of section.items) {
      if (item.children?.some((c) => c.label === selectedPage)) {
        open.add(item.label);
      }
    }
  }
  return open;
}

export function NavList({
  sections,
  selectedPage,
  onSelectPage,
  onNavigate,
}: {
  sections: NavSection[];
  selectedPage: string;
  onSelectPage: (label: string) => void;
  onNavigate?: (target: NonNullable<NavItem["navigatesTo"]>) => void;
}) {
  const [openItems, setOpenItems] = React.useState<Set<string>>(() =>
    computeInitialOpen(sections, selectedPage)
  );

  const toggle = (label: string) =>
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });

  return (
    <>
      {sections.map((section, i) => (
        <div
          key={i}
          className={cn(i > 0 && (section.heading ? "mt-5" : "mt-1"))}
        >
          {section.heading && (
            <div className="mb-1 px-2 text-[11px] font-semibold tracking-wider text-slate-400">
              {section.heading}
            </div>
          )}
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const Icon = item.icon;
              const hasChildren = !!item.children?.length;
              const isOpen = openItems.has(item.label);
              return (
                <li key={item.label}>
                  <button
                    onClick={() => {
                      if (item.navigatesTo) {
                        onNavigate?.(item.navigatesTo);
                      } else if (hasChildren) {
                        toggle(item.label);
                      } else {
                        onSelectPage(item.label);
                      }
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900",
                      selectedPage === item.label &&
                        !hasChildren &&
                        "bg-slate-100 font-medium text-slate-900"
                    )}
                    aria-expanded={hasChildren ? isOpen : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-indigo-600">
                        {item.badge}
                      </span>
                    )}
                    {item.navigatesTo && (
                      <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                    )}
                  </button>
                  {hasChildren && isOpen && (
                    <ul className="mt-0.5 space-y-0.5">
                      {item.children!.map((child) => (
                        <li key={child.label}>
                          <button
                            onClick={() => onSelectPage(child.label)}
                            className={cn(
                              "flex w-full items-center rounded-md py-1.5 pl-9 pr-2 text-left text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900",
                              selectedPage === child.label &&
                                "bg-slate-100 font-medium text-slate-900"
                            )}
                          >
                            <span className="truncate">{child.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}
