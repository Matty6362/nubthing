import { Resend } from 'resend';

const resend = new Resend('re_GEhPQAha_LX5WA2sqiMYX99pigZk9Aq8B');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { firstName, email } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const emailResponse = await resend.emails.send({
      from: 'Nubthing <noreply@nubthing.com>',
      to: email,
      subject: "You're in!",
      html: '<p>YCAYW</p>',
    });

    const dbResponse = await fetch('https://fbnznbwtxqjjwixjvvme.supabase.co/rest/v1/entries', {
      method: 'POST',
      headers: {
        apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ firstName, email })
    });

    if (!dbResponse.ok) {
      const text = await dbResponse.text();
      throw new Error(`Supabase error: ${text}`);
    }

    res.status(200).json({ message: 'Success', firstName, email });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
