import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { firstName, email } = req.body;

    if (!firstName || !email) {
      return res.status(400).json({ error: 'Missing name or email' });
    }

    // 1. Save to Supabase
    const { error: dbError } = await supabase
      .from('entries')
      .insert([{ firstName, email }]);

    if (dbError) {
      return res.status(500).json({ error: `Database error: ${dbError.message}` });
    }

    // 2. Send Email
    const { error: emailError } = await resend.emails.send({
      from: 'you@nubthing.com',
      to: email,
      subject: "You're in!",
      html: '<p>YCAYW</p>'
    });

    if (emailError) {
      return res.status(500).json({ error: `Email error: ${emailError.message}` });
    }

    return res.status(200).json({ message: 'Success' });

  } catch (err) {
    return res.status(500).json({ error: err.message || 'Unexpected server error' });
  }
};
