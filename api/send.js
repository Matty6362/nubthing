// api/send.js

import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

// Inline API keys for testing. Replace/remove these after you verify everything works.
const resend = new Resend('re_GEhPQAha_LX5WA2sqiMYX99pigZk9Aq8B');
const supabase = createClient(
  'https://qpfadowpwilkcobcombf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwZmFkb3dwd2lsa2NvYmNvbWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NzM3NjAsImV4cCI6MjA2MDE0OTc2MH0.T-FtLaH6I5lUL7JyYWb5Ui1AOrpNOFdcEYs08VjhQVg'
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, email } = req.body;

  // 1. Save to Supabase with detailed error logging
  try {
    const { data, error } = await supabase
      .from('entries')
      .insert([{ first_name: firstName, email }]);

    if (error) {
      console.error('❌ Supabase insert error:', JSON.stringify(error, null, 2));
      return res.status(500).json({ error: error.message });
    }
    console.log('✅ Supabase insert succeeded:', data);
  } catch (err) {
    console.error('🔥 Unexpected Supabase error:', err);
    return res.status(500).json({ error: 'Unexpected error' });
  }

  // 2. Send confirmation email
  try {
    await resend.emails.send({
      from: 'no-reply@nubthing.com',
      to: email,
      subject: "You're in!",
      html: `<p>Thanks for entering, ${firstName}! Your code is <strong>YCAYW</strong>.</p>`
    });
    console.log('✅ Confirmation email sent');
  } catch (emailError) {
    console.error('❌ Resend email error:', emailError);
  }

  return res.status(200).json({ success: true });
}
