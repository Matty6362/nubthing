import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const { firstName, email } = await req.json();

    // Save to Supabase
    const { error: dbError } = await supabase
      .from("entries")
      .insert([{ firstName, email }]);

    if (dbError) {
      console.error("Database error:", dbError);
      return new Response(JSON.stringify({ error: "Database error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Send confirmation email
    const { error: emailError } = await resend.emails.send({
      from: "Nubthing <hello@nubthing.com>",
      to: email,
      subject: "You're in!",
      html: "<p>YCAYW</p>",
    });

    if (emailError) {
      console.error("Email error:", emailError);
      return new Response(JSON.stringify({ error: "Email send error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
