import supabase from './db-client.js';

let localSubscribers = [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'GET') {
      if (supabase) {
        try {
          const { data, error } = await supabase.from('newsletter_subscribers').select('id, email, created_at').order('created_at', { ascending: false }).limit(200);
          if (!error && data) return res.status(200).json(data);
        } catch (dbErr) {}
      }
      return res.status(200).json(localSubscribers);
    }
    if (req.method === 'POST') {
      const { email } = req.body || {};
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'A valid email is required' });
      if (supabase) {
        try {
          const { data: existing } = await supabase.from('newsletter_subscribers').select('id').eq('email', email).limit(1);
          if (existing && existing.length > 0) return res.status(200).json({ ok: true, message: 'Already subscribed' });
          const { data, error } = await supabase.from('newsletter_subscribers').insert({ email }).select().single();
          if (!error && data) return res.status(201).json(data);
        } catch (dbErr) {}
      }
      const existingSub = localSubscribers.find((s) => s.email.toLowerCase() === email.toLowerCase());
      if (existingSub) return res.status(200).json({ ok: true, message: 'Already subscribed' });
      const newSub = { id: Date.now(), email, created_at: new Date().toISOString() };
      localSubscribers.push(newSub);
      return res.status(201).json(newSub);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
