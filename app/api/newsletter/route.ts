import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 422 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 422 }
      );
    }

    const supabase = createServerClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert({ email, source: "website" }, { onConflict: "email" });

    if (error) throw error;

    return NextResponse.json(
      { status: "subscribed", email },
      { status: 201 }
    );
  } catch (error) {
    console.error("[newsletter] Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
