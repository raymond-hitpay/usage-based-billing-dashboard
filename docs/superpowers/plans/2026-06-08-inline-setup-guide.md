# Inline Setup Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an `"inline"` setup guide variant that embeds the "Finish your setup" checklist directly inside the Overview page, always visible without any floating widget or side panel.

**Architecture:** A new `SetupGuideInline` component renders at the top of the Overview page body when `variant === "inline"`. It shows grouped steps with progress, transitions to a dismissible celebration state when all steps are complete, and disappears on dismiss. The `"inline"` string is added to the `SetupGuideVariant` union type; `AppShellV2` passes `setupGroups` down to `OverviewPage` and suppresses the floating/panel widgets in inline mode.

**Tech Stack:** React, TypeScript, Tailwind CSS, lucide-react icons. No test framework in this project — verify by running the dev server.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/lib/setup-guide-data.ts` | Add `"inline"` to `SetupGuideVariant` |
| Create | `src/components/setup-guide-inline.tsx` | New inline checklist component |
| Modify | `src/components/overview-page.tsx` | Accept `setupGroups` prop, render inline card, add third toggle button |
| Modify | `src/components/app-shell-v2.tsx` | Pass `setupGroups` to `OverviewPage`, suppress floating/panel in inline mode |

---

## Task 1: Extend `SetupGuideVariant` type

**Files:**
- Modify: `src/lib/setup-guide-data.ts:81`

- [ ] **Step 1: Add `"inline"` to the union type**

Open `src/lib/setup-guide-data.ts` and change line 81:

```ts
// Before
export type SetupGuideVariant = "floating" | "panel";

// After
export type SetupGuideVariant = "floating" | "panel" | "inline";
```

- [ ] **Step 2: Verify the project still compiles**

```bash
npx tsc --noEmit
```

Expected: no errors. If TypeScript reports exhaustive-check errors in switch statements elsewhere, add an `"inline"` case to those switches (they will be wired in later tasks).

- [ ] **Step 3: Commit**

```bash
git add src/lib/setup-guide-data.ts
git commit -m "feat: add inline variant to SetupGuideVariant type"
```

---

## Task 2: Create `SetupGuideInline` component

**Files:**
- Create: `src/components/setup-guide-inline.tsx`

- [ ] **Step 1: Create the file with the in-progress card**

```tsx
"use client";

import * as React from "react";
import { Check, Clock, X, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  countTotal,
  countRemaining,
  isAllComplete,
  type SetupGroup,
} from "@/lib/setup-guide-data";

interface SetupGuideInlineProps {
  groups: SetupGroup[];
  onNavigate: (page: string) => void;
}

export function SetupGuideInline({ groups, onNavigate }: SetupGuideInlineProps) {
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  const total = countTotal(groups);
  const remaining = countRemaining(groups);
  const completed = total - remaining;
  const allDone = isAllComplete(groups);

  if (allDone) {
    return (
      <div className="relative rounded-xl border border-green-200 bg-green-50 px-6 py-5">
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full text-green-400 hover:bg-green-100 hover:text-green-600 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500">
            <PartyPopper className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-green-900">You're all set!</p>
            <p className="mt-1 text-sm text-green-700">
              Your account is ready. You can now accept payments and payouts.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const progressPct = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 px-6 py-5">
      {/* Header */}
      <div className="mb-1 flex items-center justify-between">
        <p className="text-sm font-bold text-blue-900">Finish your setup</p>
        <p className="text-xs text-blue-500">
          {completed} of {total} steps complete
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-blue-200">
        <div
          className="h-full rounded-full bg-blue-500 transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Groups */}
      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          <div key={group.id}>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-blue-400">
              {group.title}
            </p>
            <div className="flex flex-col gap-1">
              {group.steps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-3 rounded-lg bg-white px-3 py-2.5",
                    step.completed && "opacity-50"
                  )}
                >
                  {/* Status icon */}
                  {step.completed ? (
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-500">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  ) : step.verificationStatus === "verifying" ? (
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-amber-400 bg-amber-50">
                      <Clock className="h-3 w-3 text-amber-500" />
                    </div>
                  ) : (
                    <div className="h-5 w-5 shrink-0 rounded-full border-2 border-slate-300" />
                  )}

                  {/* Label */}
                  <span
                    className={cn(
                      "flex-1 text-sm",
                      step.completed
                        ? "text-slate-400 line-through"
                        : step.verificationStatus === "verifying"
                        ? "text-amber-700"
                        : "text-slate-700"
                    )}
                  >
                    {step.verificationStatus === "verifying"
                      ? "Verifying…"
                      : step.label}
                  </span>

                  {/* CTA */}
                  {!step.completed &&
                    step.verificationStatus !== "verifying" &&
                    step.navigatesTo && (
                      <button
                        onClick={() => onNavigate(step.navigatesTo!)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Start →
                      </button>
                    )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Check it compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/setup-guide-inline.tsx
git commit -m "feat: add SetupGuideInline component"
```

---

## Task 3: Update `OverviewPage` to render the inline card

**Files:**
- Modify: `src/components/overview-page.tsx`

Changes needed:
1. Add `setupGroups: SetupGroup[]` to `OverviewPageProps`
2. Import `SetupGuideInline` and `SetupGroup`
3. Render `<SetupGuideInline>` at the top of the page body when `variant === "inline"`
4. Add an "Inline" button to the prototype toggle strip

- [ ] **Step 1: Update the import block**

At the top of `src/components/overview-page.tsx`, add to the existing imports:

```tsx
// Add SetupGroup to the existing setup-guide-data import
import { type SetupGuideVariant, type SetupGroup, countRemaining, SETUP_GROUPS } from "@/lib/setup-guide-data";
// Add the new component import
import { SetupGuideInline } from "./setup-guide-inline";
```

- [ ] **Step 2: Update `OverviewPageProps`**

```tsx
interface OverviewPageProps {
  variant: SetupGuideVariant;
  onVariantChange: (v: SetupGuideVariant) => void;
  onOpenSetupGuide: () => void;
  onNavigate: (page: string) => void;
  setupGroups: SetupGroup[];  // add this
}
```

- [ ] **Step 3: Destructure `setupGroups` in the function signature**

```tsx
export function OverviewPage({
  variant,
  onVariantChange,
  onOpenSetupGuide,
  onNavigate,
  setupGroups,       // add this
}: OverviewPageProps) {
```

- [ ] **Step 4: Add the "Inline" button to the prototype toggle**

Find the prototype toggle block (around line 528). It currently has two buttons ("Floating" and "Side Panel"). Add a third button after "Side Panel":

```tsx
<button
  onClick={() => onVariantChange("inline")}
  className={cn(
    "px-3 py-1.5 border-l border-slate-200 transition-colors",
    variant === "inline" ? "bg-slate-900 text-white" : "bg-white text-slate-500 hover:bg-slate-50"
  )}
>
  Inline
</button>
```

- [ ] **Step 5: Render the inline card at the top of the page body**

Inside the `<div className="flex-1 px-7 py-5 space-y-5">` block, add the inline card as the very first child (before the notification banner block):

```tsx
{/* ── Inline Setup Guide (variant C) ── */}
{variant === "inline" && (
  <SetupGuideInline groups={setupGroups} onNavigate={onNavigate} />
)}
```

- [ ] **Step 6: Verify dev server renders correctly**

```bash
npm run dev
```

Open the app, navigate to Overview, click "Inline" in the prototype toggle — the checklist card should appear at the top of the page with 5 steps (1 checked). The floating pill should still appear (it's suppressed in the next task).

- [ ] **Step 7: Commit**

```bash
git add src/components/overview-page.tsx
git commit -m "feat: render SetupGuideInline in OverviewPage for inline variant"
```

---

## Task 4: Wire `AppShellV2` to suppress floating widgets in inline mode

**Files:**
- Modify: `src/components/app-shell-v2.tsx`

Changes needed:
1. Pass `setupGroups` to `<OverviewPage />`
2. Suppress floating widget and pill when `variant === "inline"`

- [ ] **Step 1: Pass `setupGroups` to `OverviewPage`**

Find the `<OverviewPage ... />` JSX block (around line 184) and add the prop:

```tsx
<OverviewPage
  variant={setupGuideVariant}
  onVariantChange={handleVariantChange}
  onOpenSetupGuide={() => setSetupGuideOpen(true)}
  onNavigate={handleNavigateWithVerificationTracking}
  setupGroups={setupGroups}
/>
```

- [ ] **Step 2: Suppress the floating widget block in inline mode**

The floating widget block starts with `{setupGuideVariant === "floating" && ...}`. Wrap the entire floating block condition to also exclude inline:

```tsx
{/* ── Setup Guide: Version A — Floating widget ── */}
{setupGuideVariant === "floating" && (() => {
  // ... existing code unchanged ...
})()}
```

This already only renders when `setupGuideVariant === "floating"`, so it naturally suppresses in `"inline"` mode — no change needed here.

Same for the panel block: `{setupGuideVariant === "panel" && ...}` — also already correct.

So the only required change in `AppShellV2` is passing `setupGroups` to `OverviewPage` (Step 1 above).

- [ ] **Step 3: Verify full end-to-end flow**

```bash
npm run dev
```

1. Open Overview → click "Inline" — setup card appears at top, floating pill disappears
2. Click "Start →" on Account Verification — Account Verification overlay opens
3. Close overlay — returns to Overview, card still shows same step as incomplete
4. Click "Floating" — floating pill returns, inline card gone
5. Click "Side Panel" — side panel banner shown, inline card gone

- [ ] **Step 4: Commit**

```bash
git add src/components/app-shell-v2.tsx
git commit -m "feat: pass setupGroups to OverviewPage for inline variant"
```

---

## Task 5: Verify the all-done celebration and dismiss

**Files:** No code changes — this task is verification only.

- [ ] **Step 1: Temporarily mark all steps complete to test celebration state**

In `src/lib/setup-guide-data.ts`, temporarily set all steps to `completed: true`:

```ts
{ id: "account-verification", ..., completed: true },
{ id: "bank-account", ..., completed: true },
{ id: "qr-payments", ..., completed: true },
{ id: "card-payments", ..., completed: true },
```

- [ ] **Step 2: Verify celebration state renders**

With the dev server running, navigate to Overview → click "Inline". The card should show the green "You're all set!" celebration banner with a × button.

- [ ] **Step 3: Verify dismiss works**

Click × — the card should disappear. The rest of the Overview page (Feature Carousel, stats, charts) should be unaffected.

- [ ] **Step 4: Revert the temporary change**

```ts
{ id: "account-verification", ..., completed: false },
{ id: "bank-account", ..., completed: false },
{ id: "qr-payments", ..., completed: false },
{ id: "card-payments", ..., completed: false },
```

- [ ] **Step 5: Confirm the in-progress card is back**

Reload the app on Overview with "Inline" selected — checklist card shows 1 of 5 complete.
