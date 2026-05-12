import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/newsletter
 *
 * Accepts email signups. When Supabase is connected, inserts into
 * newsletter_subscribers table. For now, logs and returns success.
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 422 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 422 }
      );
    }

    // TODO: When Supabase is connected:
    // const supabase = createServerClient();
    // const { error } = await supabase
    //   .from('newsletter_subscribers')
    //   .upsert({ email, source: 'website' }, { onConflict: 'email' });
    // if (error) throw error;

    console.log(`[newsletter] New signup: ${email}`);

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
