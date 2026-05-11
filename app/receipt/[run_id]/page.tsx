import { notFound } from "next/navigation";
import { getRunById } from "@/lib/data/index";
import { ReceiptClient } from "./receipt-client";

export default async function ReceiptPage({
  params,
}: {
  params: Promise<{ run_id: string }>;
}) {
  const { run_id } = await params;
  const run = getRunById(run_id);

  if (!run) {
    notFound();
  }

  return <ReceiptClient run={run} />;
}
