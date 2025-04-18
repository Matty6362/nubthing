import { Resend } from 'resend';

const resend = new Resend('re_GEhPQAha_LX5WA2sqiMYX99pigZk9Aq8B');

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { firstName, email } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    console.log("📨 Attempting to send email to:", email);

    const emailResponse = await resend.emails.send({
      from: 'Nubthing <noreply@nubthing.com>', // Temporarily try 'onboarding@resend.dev' if this fails
      to: email,
      subject: "You're in!",
      html: "<p>YCAYW</p>",
    });

    console.log("✅ Resend API response:", JSON.stringify(emailResponse, null, 2));

    const dbResponse = await fetch('https://fbnznbwtxqjjwixjvvme.supabase.co/rest/v1/entries', {
      method: 'POST',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZibnpuYnd0eHFqandpeGp2dm1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMwMjk2NzIsImV4cCI6MjAyODYwNTY3Mn0.3YxwCrSxDvnmp_W9e9YOWhC3u7O9XznRzPQmhl5fDpM',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZibnpuYnd0eHFqandpeGp2dm1lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMwMjk2NzIsImV4cCI6MjAyODYwNTY3Mn0.3YxwCrSxDvnmp_W9e9YOWhC3u7O9XznRzPQmhl5fDpM',
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ firstName, email })
    });

    const dbText = await dbResponse.text();
    console.log("📄 Supabase response status:", dbResponse.status);
    console.log("📄 Supabase response text:", dbText);

    if (!dbResponse.ok) {
      throw new Error(`Supabase error: ${dbText}`);
    }

    return res.status(200).json({ message: "Success", firstName, email });
  } catch (err) {
    console.error('❌ Server error:', err);
    return res.status(500).json({
      message: "Server error",
      error: err.message || err.toString(),
      stack: err.stack || "No stack trace"
    });
  }
}

