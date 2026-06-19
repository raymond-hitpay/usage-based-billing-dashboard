# Inline Setup Guide — Design Spec
**Date:** 2026-06-08

## Context

The existing "Finish your setup" widget lives as a floating bottom-right card (or a slide-in side panel). Both require the user to notice and interact with a widget separate from the page. This spec adds a third variant — `"inline"` — that embeds the setup checklist directly inside the Overview page so it is immediately visible on first load, no interaction required.

## What We're Building

A new `SetupGuideInline` component rendered at the top of the Overview page body. It replaces the floating widget and pill when `variant === "inline"` is active.

---

## Component: `SetupGuideInline`

**File:** `src/components/setup-guide-inline.tsx`

### Props

```ts
interface SetupGuideInlineProps {
  groups: SetupGroup[];
  onNavigate: (page: string) => void;
}
```

### In-progress state

Shown when `isAllComplete(groups)` is false.

- **Header row**: "Finish your setup" (bold) + "X of Y steps complete" subtext
- **Progress bar**: thin blue bar, width = `(completed / total) * 100%`
- **Steps**: grouped by `SetupGroup`. Each group shows its `title` as a small uppercase section label, then its steps:
  - Completed step: green filled checkmark circle + gray/strikethrough label
  - Incomplete step with `navigatesTo`: empty circle + label + "Start →" link (calls `onNavigate`)
  - Incomplete step without `navigatesTo`: empty circle + label (no CTA)
  - Step with `verificationStatus === "verifying"`: clock icon + "Verifying…" label

### All-done state

Shown when `isAllComplete(groups)` is true and the card has not been dismissed.

- Full-width celebration banner inside the card
- Success icon (e.g. checkmark in a green circle)
- Heading: "You're all set!"
- Subtext: "Your account is ready. You can now accept payments and payouts."
- Dismiss button (×) top-right — on click, sets local `dismissed` state to `true`

### Dismissed state

When `dismissed === true`: component returns `null` (card removed from DOM).

---

## Wiring into `OverviewPage`

**File:** `src/components/overview-page.tsx`

- Add `setupGroups: SetupGroup[]` to `OverviewPageProps`
- Render `<SetupGuideInline groups={setupGroups} onNavigate={onNavigate} />` as the first element inside the page body (above `FeatureCarousel`), only when `variant === "inline"`
- Add a third **"Inline"** button to the prototype toggle strip in the page header

---

## Wiring into `AppShellV2`

**File:** `src/components/app-shell-v2.tsx`

- `SetupGuideVariant` type extended to include `"inline"` (in `setup-guide-data.ts`)
- Pass `setupGroups={setupGroups}` to `<OverviewPage />`
- When `variant === "inline"`: skip rendering `SetupGuideFloating`, `SetupGuidePill`, and `SetupGuideSidePanel` entirely

---

## Type change

**File:** `src/lib/setup-guide-data.ts`

```ts
// Before
export type SetupGuideVariant = "floating" | "panel";

// After
export type SetupGuideVariant = "floating" | "panel" | "inline";
```

---

## Verification

1. Toggle to "Inline" in the prototype switcher on the Overview page — the floating pill disappears and the setup card appears at the top of the page
2. Click "Start →" on an incomplete step — navigates to the correct page, card disappears off-screen (Overview not active)
3. Return to Overview — card is still there, same progress
4. Mark all steps complete — card transitions to the "You're all set!" celebration state
5. Click × — card is removed, rest of Overview page is unaffected
6. Toggle back to "Floating" or "Panel" — those variants behave as before, inline card is gone
