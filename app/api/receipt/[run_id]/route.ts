import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

/**
 * GET /api/receipt/[run_id]
 *
 * Returns the signed manifest as JSON for programmatic consumption.
 * This is the machine-readable receipt that downstream systems
 * (AgentFolio, SATP, reputation systems) can fetch and verify.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ run_id: string }> }
) {
  const { run_id } = await params;

  if (!run_id) {
    return NextResponse.json({ error: "run_id required" }, { status: 400 });
  }

  try {
    // Try Supabase first
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("submissions")
      .select("manifest")
      .eq("run_id", run_id)
      .single();

    if (data?.manifest) {
      return NextResponse.json(data.manifest, {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=86400, immutable",
          "X-Benchd-Receipt": "true",
          "X-Benchd-Run-Id": run_id,
        },
      });
    }

    // Fallback: return a stub indicating the receipt exists but isn't in the DB yet
    return NextResponse.json(
      {
        error: "receipt_not_found",
        run_id,
        message: "Receipt not found in database. It may not have been submitted yet.",
        verify_url: `https://benchd.ai/receipt/${run_id}`,
        submit_url: "https://benchd.ai/submit",
      },
      { status: 404 }
    );
  } catch {
    return NextResponse.json(
      { error: "internal_error", message: "Failed to fetch receipt" },
      { status: 500 }
    );
  }
}
