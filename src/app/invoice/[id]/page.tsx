import { InvoicePreview } from "@/components/invoice-preview";

export default async function InvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ model?: string }>;
}) {
  const { id } = await params;
  const { model } = await searchParams;
  const pricingModel = model === "volume" ? "volume" : "graduated";
  return (
    <InvoicePreview
      invoiceId={decodeURIComponent(id)}
      pricingModel={pricingModel}
    />
  );
}
