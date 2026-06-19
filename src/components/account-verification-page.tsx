"use client";

import * as React from "react";
import { Check, CheckCircle2, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// ─── Step / group definitions ──────────────────────────────────────────────────

type StepId =
  | "business-type"
  | "documents"
  | "business-details"
  | "identity"
  | "personnel"
  | "review";

interface Step {
  id: StepId;
  label: string;
  completed: boolean;
}

interface StepGroup {
  id: string;
  label: string;
  steps?: Step[];          // sub-steps (optional — review has none)
  isStandaloneStep?: true; // treat the group itself as a single step
  stepId?: StepId;
}

const GROUPS: StepGroup[] = [
  {
    id: "verify",
    label: "Verify your business",
    steps: [
      { id: "business-type",    label: "Business type",    completed: true },
      { id: "documents",        label: "Documents",         completed: true },
      { id: "business-details", label: "Business details",  completed: true },
      { id: "identity",         label: "Identity",          completed: true },
      { id: "personnel",        label: "Personnel",         completed: true },
    ],
  },
  {
    id: "review",
    label: "Review & Submit",
    isStandaloneStep: true,
    stepId: "review",
  },
];

// ─── Dummy form helpers ────────────────────────────────────────────────────────

function Field({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-800">{label}</label>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      <Input defaultValue={value} />
    </div>
  );
}

function FormShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-lg">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      {description && (
        <p className="mt-2 text-sm text-slate-500 leading-relaxed">{description}</p>
      )}
      <div className="mt-8 space-y-5">{children}</div>
    </div>
  );
}

// ─── Step forms ───────────────────────────────────────────────────────────────

function BusinessTypeForm() {
  return (
    <FormShell title="Business Type" description="Tell us about your business and how you accept payments.">
      <Field label="Business Type" value="Company" />
      <Field label="Payment Modes" value="Online" />
      <Field label="Business Category" value="Accounting/Bookkeeping Services" />
      <Field label="Business Description" value="Testing 123" />
      <Field label="Website" value="https://hitpayapp.com" />
    </FormShell>
  );
}

function DocumentsForm() {
  return (
    <FormShell title="Documents" description="Upload documents to verify your business.">
      <Field label="Verification Method" value="Singpass" />
      <Field label="Uploaded Documents" value="1.png" />
    </FormShell>
  );
}

function BusinessDetailsForm() {
  return (
    <FormShell title="Business Details" description="Provide your registered business information.">
      <Field label="Business Name" value="Ignite Company" />
      <Field label="Registration Number" value="12345678A" />
      <Field label="Date of Incorporation" value="1982-02-01" />
      <Field label="Registered Address" value="Blk 2, Kaki Bukit Avenue 1, #3-6, Singapore 417938" />
      <Field label="Principal Place of Business" value="Same as registered address" />
      <Field label="Country of Incorporation" value="Singapore" />
    </FormShell>
  );
}

function IdentityForm() {
  return (
    <FormShell
      title="Identity"
      description="This information is collected to verify your identity and meet regulatory requirements."
    >
      <Field label="Full Name" value="John Doe" hint="Enter your full name as it appears on official government documents." />
      <Field label="NRIC / Passport" value="S1234567D" />
      <Field label="Date of Birth" value="1985-06-15" />
      <Field label="Nationality" value="Singaporean" />
    </FormShell>
  );
}

function PersonnelForm() {
  return (
    <FormShell title="Personnel" description="Add directors and shareholders of your business.">
      <Field label="Director Name" value="John Doe" />
      <Field label="Shareholder Name" value="Jane Doe" />
      <Field label="Ownership %" value="100%" />
    </FormShell>
  );
}

// ─── Review sections ───────────────────────────────────────────────────────────

const REVIEW_SECTIONS = [
  {
    title: "Business Type",
    fields: [
      { label: "Business Type", value: "Company" },
      { label: "Payment Modes", value: "Online" },
      { label: "Business Category", value: "Accounting/Bookkeeping Services" },
      { label: "Business Description", value: "Testing 123" },
      { label: "Website", value: "https://hitpayapp.com" },
    ],
  },
  {
    title: "Documents",
    fields: [
      { label: "Verification Method", value: "Singpass" },
      { label: "Uploaded Documents", value: "1.png" },
    ],
  },
  {
    title: "Business Details",
    fields: [
      { label: "Business Name", value: "Ignite Company" },
      { label: "Registration Number", value: "12345678A" },
      { label: "Date of Incorporation", value: "1982-02-01" },
      { label: "Registered Address", value: "Blk 2, Kaki Bukit Avenue 1, #3-6, Singapore 417938" },
    ],
  },
  {
    title: "Identity",
    fields: [
      { label: "Full Name", value: "John Doe" },
      { label: "NRIC / Passport", value: "S1234567D" },
      { label: "Date of Birth", value: "1985-06-15" },
      { label: "Nationality", value: "Singaporean" },
    ],
  },
  {
    title: "Personnel",
    fields: [
      { label: "Director Name", value: "John Doe" },
      { label: "Shareholder Name", value: "Jane Doe" },
      { label: "Ownership %", value: "100%" },
    ],
  },
];

type VerificationStatus = "idle" | "verifying" | "verified";

function ReviewView({
  verificationStatus,
  onSubmit,
  onMarkVerified,
}: {
  verificationStatus: VerificationStatus;
  onSubmit: () => void;
  onMarkVerified: () => void;
}) {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-900">Review & Submit</h2>
      <p className="mt-2 text-sm text-slate-500">
        Review your information before submitting for verification.
      </p>

      {/* Status banners */}
      {verificationStatus === "verifying" && (
        <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 shrink-0 text-amber-500" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Your account is being verified</p>
              <p className="text-xs text-amber-700 mt-0.5">This may take a few moments. Please wait.</p>
            </div>
          </div>
          <button
            onClick={onMarkVerified}
            className="shrink-0 rounded-md border border-amber-300 bg-white px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors"
          >
            Mark as verified ✓
          </button>
        </div>
      )}
      {verificationStatus === "verified" && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">Your account has been verified!</p>
            <p className="text-xs text-emerald-700 mt-0.5">You're all set to start accepting payments.</p>
          </div>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4">
        {REVIEW_SECTIONS.map((s) => (
          <div key={s.title} className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-3">
              <span className="font-semibold text-slate-900">{s.title}</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 px-5 py-4">
              {s.fields.map((f) => (
                <div key={f.label}>
                  <p className="text-xs text-slate-400">{f.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-slate-900 break-words">{f.value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step content router ───────────────────────────────────────────────────────

function StepContent({
  stepId,
  verificationStatus,
  onSubmit,
  onMarkVerified,
}: {
  stepId: StepId;
  verificationStatus: VerificationStatus;
  onSubmit: () => void;
  onMarkVerified: () => void;
}) {
  switch (stepId) {
    case "business-type":    return <BusinessTypeForm />;
    case "documents":        return <DocumentsForm />;
    case "business-details": return <BusinessDetailsForm />;
    case "identity":         return <IdentityForm />;
    case "personnel":        return <PersonnelForm />;
    case "review":           return <ReviewView verificationStatus={verificationStatus} onSubmit={onSubmit} onMarkVerified={onMarkVerified} />;
  }
}

// ─── Grouped stepper ───────────────────────────────────────────────────────────

function GroupedStepper({
  activeStep,
  onSelect,
}: {
  activeStep: StepId;
  onSelect: (id: StepId) => void;
}) {
  return (
    <nav className="flex flex-col gap-5">
      {GROUPS.map((group) => {
        const isStandalone = group.isStandaloneStep;
        const isGroupActive = isStandalone
          ? activeStep === group.stepId
          : group.steps?.some((s) => s.id === activeStep);
        const isGroupDone = isStandalone
          ? false
          : group.steps?.every((s) => s.completed);

        return (
          <div key={group.id}>
            {/* Group label row */}
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              onClick={() => {
                if (isStandalone && group.stepId) onSelect(group.stepId);
                else if (group.steps?.[0]) onSelect(group.steps[0].id);
              }}
            >
              {/* Group circle indicator */}
              {isGroupDone ? (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600">
                  <Check className="h-3 w-3 text-white" strokeWidth={3} />
                </span>
              ) : isGroupActive ? (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-blue-600 bg-white">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                </span>
              ) : (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-slate-300" />
              )}
              <span
                className={cn(
                  "text-sm font-semibold",
                  isGroupActive ? "text-slate-900" : "text-slate-500"
                )}
              >
                {group.label}
              </span>
            </div>

            {/* Sub-steps */}
            {group.steps && (
              <ul className="mt-1.5 ml-2.5 border-l-2 border-slate-100 pl-5 space-y-0.5">
                {group.steps.map((step) => {
                  const isActive = step.id === activeStep;
                  return (
                    <li key={step.id}>
                      <button
                        onClick={() => onSelect(step.id)}
                        className={cn(
                          "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                          isActive
                            ? "text-blue-600 font-medium"
                            : step.completed
                            ? "text-slate-500 hover:text-slate-700"
                            : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        {/* Sub-step dot */}
                        {step.completed ? (
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-600">
                            <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                          </span>
                        ) : isActive ? (
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-blue-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                          </span>
                        ) : (
                          <span className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-200" />
                        )}
                        {step.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </nav>
  );
}

// ─── Full-page overlay ─────────────────────────────────────────────────────────

interface AccountVerificationPageProps {
  onClose: () => void;
  verificationStatus: VerificationStatus;
  onSubmit: () => void;
  onMarkVerified: () => void;
}

const STEP_ORDER: StepId[] = [
  "business-type",
  "documents",
  "business-details",
  "identity",
  "personnel",
  "review",
];

export function AccountVerificationPage({ onClose, verificationStatus, onSubmit, onMarkVerified }: AccountVerificationPageProps) {
  const [activeStep, setActiveStep] = React.useState<StepId>("business-type");

  function goToNextStep() {
    const idx = STEP_ORDER.indexOf(activeStep);
    if (idx < STEP_ORDER.length - 1) {
      setActiveStep(STEP_ORDER[idx + 1]);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-white">
      {/* ── Top bar ── */}
      <div className="flex items-center gap-4 border-b border-slate-200 px-6 py-3.5">
        <button
          onClick={onClose}
          className="flex items-center justify-center rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        <span className="text-sm font-medium text-slate-700">Activate your account</span>
        <div className="ml-auto">
          {activeStep === "review" ? (
            verificationStatus === "idle" && (
              <Button size="sm" onClick={onSubmit}>Submit for Verification</Button>
            )
          ) : (
            <Button size="sm" onClick={goToNextStep}>Save & Continue</Button>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: stepper */}
        <aside className="hidden w-64 shrink-0 overflow-y-auto border-r border-slate-100 px-6 py-8 md:block lg:w-72">
          <GroupedStepper activeStep={activeStep} onSelect={setActiveStep} />
        </aside>

        {/* Right: content */}
        <main className="flex-1 overflow-y-auto px-6 py-10 md:px-12 lg:px-20">
          <StepContent stepId={activeStep} verificationStatus={verificationStatus} onSubmit={onSubmit} onMarkVerified={onMarkVerified} />
        </main>
      </div>
    </div>
  );
}
