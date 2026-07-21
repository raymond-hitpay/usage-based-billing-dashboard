import { InvoicePreview } from "@/components/invoice-preview";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { id } = await params;
  return (
    <InvoicePreview
      invoiceId={decodeURIComponent(id)}
    />
  );
}
