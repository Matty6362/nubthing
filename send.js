import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';

const resend = new Resend('re_GEhPQAha_LX5WA2sqiMYX99pigZk9Aq8B');
const supabase = createClient(
  'https://qpfadowpwilkcobcombf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFwZmFkb3dwd2lsa2NvYmNvbWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NzM3NjAsImV4cCI6MjA2MDE0OTc2MH0.T-FtLaH6I5lUL7JyYWb5Ui1AOrpNOFdcEYs08VjhQVg'
);

export default async (req, res) => {
  if (req.method === 'POST') {
    const { firstName, email } = req.body;

    const { error } = await supabase.from('contest_entries').insert([{ firstName, email }]);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    try {
      await resend.emails.send({
        from: 'team@nubthing.com',
        to: email,
        subject: "You're in!",
        html: '<h1>YCAYW</h1>',
      });
      res.status(200).json({ message: 'Success' });
    } catch (emailError) {
      res.status(500).json({ error: emailError.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
