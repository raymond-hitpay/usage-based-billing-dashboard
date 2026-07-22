"use client";

import * as React from "react";
import { useState } from "react";
import { X, Check } from "lucide-react";

interface CardPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  amount: number;
  onSuccess?: () => void;
}

interface FormErrors {
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
  cardholderName?: string;
  general?: string;
}

const savedCardContext = React.createContext<{
  cardSaved: boolean;
  setCardSaved: (saved: boolean) => void;
} | null>(null);

export function CardPaymentModal({
  isOpen,
  onClose,
  featureName,
  amount,
  onSuccess,
}: CardPaymentModalProps) {
  const [step, setStep] = useState<"form" | "confirm" | "success">("form");
  const [formData, setFormData] = useState({
    cardNumber: "4242 4242 4242 4242",
    expiryDate: "12/26",
    cvc: "123",
    cardholderName: "John Doe",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [cardSaved, setCardSaved] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('cardSaved') === 'true';
    }
    return false;
  });

  React.useEffect(() => {
    if (!isOpen) {
      if (paymentProcessed) {
        setPaymentProcessed(false);
      }
      if (!cardSaved) {
        setStep("form");
      } else {
        setStep("confirm");
      }
    }
  }, [isOpen, cardSaved]);

  const saveCard = (saved: boolean) => {
    setCardSaved(saved);
    if (typeof window !== 'undefined') {
      if (saved) {
        sessionStorage.setItem('cardSaved', 'true');
      } else {
        sessionStorage.removeItem('cardSaved');
      }
    }
  };

  if (!isOpen) return null;

  const formatCardNumber = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.slice(i, i + 4));
    }
    return parts.join(" ");
  };

  const formatExpiryDate = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate card number
    const cardDigits = formData.cardNumber.replace(/\D/g, "");
    if (!cardDigits) {
      newErrors.cardNumber = "Card number is required";
    } else if (cardDigits.length !== 16) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    // Validate expiry date
    if (!formData.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (formData.expiryDate.length !== 5) {
      newErrors.expiryDate = "Please enter expiry in MM/YY format";
    } else {
      const [month, year] = formData.expiryDate.split("/");
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);

      if (monthNum < 1 || monthNum > 12) {
        newErrors.expiryDate = "Month must be between 01 and 12";
      } else {
        // Check if date is in the future
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;

        if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
          newErrors.expiryDate = "Card has expired";
        }
      }
    }

    // Validate CVC
    const cvcDigits = formData.cvc.replace(/\D/g, "");
    if (!cvcDigits) {
      newErrors.cvc = "CVC is required";
    } else if (cvcDigits.length < 3 || cvcDigits.length > 4) {
      newErrors.cvc = "CVC must be 3 or 4 digits";
    }

    // Validate cardholder name
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    } else if (formData.cardholderName.trim().length < 2) {
      newErrors.cardholderName = "Name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData((prev) => ({ ...prev, cardNumber: formatted }));
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: undefined }));
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setFormData((prev) => ({ ...prev, expiryDate: formatted }));
    if (errors.expiryDate) {
      setErrors((prev) => ({ ...prev, expiryDate: undefined }));
    }
  };

  const handleCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
    setFormData((prev) => ({ ...prev, cvc: digits }));
    if (errors.cvc) {
      setErrors((prev) => ({ ...prev, cvc: undefined }));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, cardholderName: e.target.value }));
    if (errors.cardholderName) {
      setErrors((prev) => ({ ...prev, cardholderName: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsSubmitting(false);
      saveCard(true);
      setPaymentProcessed(true);
      setStep("success");
    }, 1500);
  };

  const handleClose = () => {
    onClose();
    setStep("form");
    setFormData({
      cardNumber: "4242 4242 4242 4242",
      expiryDate: "12/26",
      cvc: "123",
      cardholderName: "John Doe",
    });
    setErrors({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-lg flex flex-col max-h-[90vh] rounded-xl bg-white shadow-xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 transition-colors z-10"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Success state */}
        {step === "success" ? (
          <div className="flex flex-col items-center justify-center px-6 py-12">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <Check className="h-8 w-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Subscription activated!</h2>
            <p className="text-center text-sm text-slate-500 mb-8">
              Your subscription to <strong>{featureName}</strong> is now active. Charges will appear on your next billing cycle.
            </p>
            <button
              onClick={() => {
                onSuccess?.();
                handleClose();
              }}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Done
            </button>
          </div>
        ) : step === "confirm" ? (
          <>
            {/* Confirm step - using saved card */}
            <div className="border-b border-slate-200 px-6 pt-6 pb-4">
              <div className="inline-block text-xs font-bold uppercase rounded px-2.5 py-1 mb-3 bg-green-100 text-green-700">
                Saved card
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Subscribe to {featureName}
              </h2>
              <p className="text-sm text-slate-500">
                Using your saved card to complete the subscription.
              </p>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-6 space-y-5">
              {/* Saved card display */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Saved card</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-slate-900">{formData.cardholderName}</p>
                  <p className="text-sm text-slate-600">•••• •••• •••• {formData.cardNumber.slice(-4)}</p>
                  <p className="text-xs text-slate-500">Expires {formData.expiryDate}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 px-6 py-4 bg-white rounded-b-xl flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitting(true);
                  setTimeout(() => {
                    setIsSubmitting(false);
                    setPaymentProcessed(true);
                    setStep("success");
                  }, 1500);
                }}
                disabled={isSubmitting}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Confirm"}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Header */}
            <div className="border-b border-slate-200 px-6 pt-6 pb-4">
              <div className="inline-block text-xs font-bold uppercase rounded px-2.5 py-1 mb-3 bg-blue-100 text-blue-700">
                Payment details
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Subscribe to {featureName}
              </h2>
              <p className="text-sm text-slate-500">
                Enter your card details to complete the subscription.
              </p>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto flex-1 px-6 py-6">
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Cardholder name */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1.5">
                    Cardholder name
                  </label>
                  <input
                    type="text"
                    value={formData.cardholderName}
                    onChange={handleNameChange}
                    placeholder="John Doe"
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors ${
                      errors.cardholderName
                        ? "border-red-300 bg-red-50 text-slate-900 focus:border-red-400 focus:bg-white"
                        : "border-slate-200 bg-white text-slate-900 focus:border-blue-300 focus:bg-white"
                    }`}
                  />
                  {errors.cardholderName && (
                    <p className="mt-1 text-xs text-red-600">{errors.cardholderName}</p>
                  )}
                </div>

                {/* Card number */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-1.5">
                    Card number
                  </label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="4242 4242 4242 4242"
                    maxLength={19}
                    className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors ${
                      errors.cardNumber
                        ? "border-red-300 bg-red-50 text-slate-900 focus:border-red-400 focus:bg-white"
                        : "border-slate-200 bg-white text-slate-900 focus:border-blue-300 focus:bg-white"
                    }`}
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-xs text-red-600">{errors.cardNumber}</p>
                  )}
                </div>

                {/* Expiry and CVC */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1.5">
                      Expiry date
                    </label>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      maxLength={5}
                      className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors ${
                        errors.expiryDate
                          ? "border-red-300 bg-red-50 text-slate-900 focus:border-red-400 focus:bg-white"
                          : "border-slate-200 bg-white text-slate-900 focus:border-blue-300 focus:bg-white"
                      }`}
                    />
                    {errors.expiryDate && (
                      <p className="mt-1 text-xs text-red-600">{errors.expiryDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1.5">
                      CVC
                    </label>
                    <input
                      type="text"
                      value={formData.cvc}
                      onChange={handleCVCChange}
                      placeholder="123"
                      maxLength={4}
                      className={`w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors ${
                        errors.cvc
                          ? "border-red-300 bg-red-50 text-slate-900 focus:border-red-400 focus:bg-white"
                          : "border-slate-200 bg-white text-slate-900 focus:border-blue-300 focus:bg-white"
                      }`}
                    />
                    {errors.cvc && (
                      <p className="mt-1 text-xs text-red-600">{errors.cvc}</p>
                    )}
                  </div>
                </div>

                {errors.general && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                    <p className="text-sm text-red-600">{errors.general}</p>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Processing..." : "Subscribe"}
                  </button>
                </div>
              </form>
            </div>

            {/* Footer info */}
            <div className="border-t border-slate-200 px-6 py-4 bg-white rounded-b-xl">
              <p className="text-center text-xs text-slate-400">
                Your card details are secure and encrypted. Cancel anytime.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
