import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://sifbvhqczmcgrgxwnhwg.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpZmJ2aHFjem1jZ3JneHduaHd...
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { firstName, email } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    // Save to Supabase
    const { error } = await supabase.from("contest_entries").insert([
      { first_name: firstName, email },
    ]);

    if (error) {
      console.error("Supabase insert error:", error.message);
      return res.status(500).json({ message: "Database error" });
    }

    // Send confirmation email
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer re_GEhPQAha_LX5WA2sqiMYX99pigZk9Aq8B",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Nubthing <hello@nubthing.com>",
        to: email,
        subject: "You're in!",
        html: "<p>YCAYW</p>",
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Resend error:", errText);
      return res.status(500).json({ message: "Email failed" });
    }

    console.log(`New entry: ${firstName} – ${email}`);
    return res.status(200).json({ message: "Success", firstName, email });

  } catch (err) {
    console.error("Unhandled error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
