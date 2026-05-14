import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.manifest || !data.signature || !data.public_key) {
      return NextResponse.json(
        { error: "Missing required fields: manifest, signature, public_key" },
        { status: 422 }
      );
    }

    const manifest =
      typeof data.manifest === "string"
        ? JSON.parse(data.manifest)
        : data.manifest;

    if (!manifest.run_id) {
      return NextResponse.json(
        { error: "Manifest missing run_id" },
        { status: 422 }
      );
    }

    if (!manifest.system || !manifest.benchmark) {
      return NextResponse.json(
        { error: "Manifest missing system or benchmark" },
        { status: 422 }
      );
    }

    const runId = manifest.run_id;
    const systemName = manifest.system?.name || "unknown";
    const benchmarkName = manifest.benchmark?.name || "unknown";
    const scores = manifest.scores || {};
    const fingerprint = data.signing_key_fingerprint || "unknown";
    const signedAt = data.signed_at || new Date().toISOString();

    const supabase = createServerClient();
    const { error } = await supabase.from("submissions").insert({
      run_id: runId,
      system_name: systemName,
      benchmark_name: benchmarkName,
      scores,
      manifest: data,
      fingerprint,
      signed_at: signedAt,
      status: "pending_review",
    });

    if (error) throw error;

    return NextResponse.json(
      {
        status: "accepted",
        run_id: runId,
        system: systemName,
        benchmark: benchmarkName,
        message:
          "Submission received. Results will be reviewed and published within 24 hours.",
        url: `https://benchd.ai/receipt/${runId}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[submit] Error:", error);
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }
}
