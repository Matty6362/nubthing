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
    const emailResponse = await resend.emails.send({
      from: 'Nubthing <noreply@nubthing.com>',
      to: email,
      subject: "You're in!",
      html: "<p>YCAYW</p>",
    });

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

    if (!dbResponse.ok) {
      const errorText = await dbResponse.text();
      throw new Error(`Supabase error: ${errorText}`);
    }

    return res.status(200).json({ message: "Success", firstName, email });
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}