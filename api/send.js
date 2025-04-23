import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, email } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ error: 'Missing firstName or email' });
  }

  try {
    // Store in Supabase
    const { error: dbError } = await supabase
      .from('submissions')
      .insert([{ first_name: firstName, email }]);

    if (dbError) {
      throw dbError;
    }

    // Send confirmation email
    await resend.emails.send({
      from: 'Nubthing <hello@nubthing.com>',
      to: email,
      subject: "You're in!",
      html: `<p>YCAYW</p>`,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('API Error:', err.message);
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
