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

  // 1. Insert into Supabase
  const { error: dbError } = await supabase
    .from('entries')
    .insert([{ first_name: firstName, email }]);

  if (dbError) {
    console.error('Supabase error:', dbError);
    return res.status(500).json({ error: 'Database insert failed' });
  }

  // 2. Send confirmation email
  try {
    await resend.emails.send({
      from: 'no-reply@nubthing.com',
      to: email,
      subject: "You're in!",
      html: `<p>Thanks for entering, ${firstName}! Your code is <strong>YCAYW</strong>.</p>`
    });
  } catch (emailError) {
    console.error('Resend email error:', emailError);
  }

  return res.status(200).json({ success: true });
}
