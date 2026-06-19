export interface StepCategory {
  id: string;
  label: string;
  enabled: boolean;
}

export interface SetupStep {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  navigatesTo?: string; // page label to navigate to
  verificationStatus?: "verifying" | "verified";
  categories?: StepCategory[]; // optional sub-category tags (e.g. payment method groups)
}

export interface SetupGroup {
  id: string;
  title: string;
  steps: SetupStep[];
}

export const SETUP_GROUPS: SetupGroup[] = [
  {
    id: "verify",
    title: "Verify your Account",
    steps: [
      {
        id: "create-account",
        label: "Create account",
        description: "Your HitPay account has been created.",
        completed: true,
      },
      {
        id: "account-verification",
        label: "Account verification",
        description: "Submit your business details for KYB verification.",
        completed: false,
        navigatesTo: "Account Verification",
      },
    ],
  },
  {
    id: "payments",
    title: "Set up Payments",
    steps: [
      {
        id: "bank-account",
        label: "Link bank account",
        description: "Add a bank account to receive payouts.",
        completed: false,
        navigatesTo: "Bank Accounts",
      },
      {
        id: "enable-payments",
        label: "Enable payment methods",
        description: "Choose which methods your customers can pay with.",
        completed: true, // PayNow (Local QR) is already active
        navigatesTo: "Payment Methods",
        categories: [
          { id: "local-qr", label: "Local QR", enabled: true },
          { id: "cards", label: "Cards", enabled: false },
          { id: "crossborder", label: "Cross Border", enabled: false },
        ],
      },
    ],
  },
];

export function countRemaining(groups: SetupGroup[]): number {
  return groups.flatMap((g) => g.steps).filter((s) => !s.completed).length;
}

export function countTotal(groups: SetupGroup[]): number {
  return groups.flatMap((g) => g.steps).length;
}

export function isAllComplete(groups: SetupGroup[]): boolean {
  return groups.flatMap((g) => g.steps).every((s) => s.completed);
}

export function nextIncompleteStep(groups: SetupGroup[]): SetupStep | null {
  return groups.flatMap((g) => g.steps).find((s) => !s.completed) ?? null;
}

export type SetupGuideVariant = "floating" | "panel" | "inline";
