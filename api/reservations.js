import supabase from './db-client.js';

let localReservations = [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'GET') {
      if (supabase) {
        try {
          const { data, error } = await supabase.from('reservations').select('*').order('reservation_date', { ascending: true }).order('reservation_time', { ascending: true });
          if (!error && data) return res.status(200).json(data);
        } catch (dbErr) {}
      }
      return res.status(200).json(localReservations);
    }
    if (req.method === 'POST') {
      const { name, email, phone, guests, reservation_date, reservation_time, occasion, notes } = req.body || {};
      if (!name || !email || !guests || !reservation_date || !reservation_time) {
        return res.status(400).json({ error: 'Name, email, guests, date and time are required' });
      }
      if (supabase) {
        try {
          const { data, error } = await supabase.from('reservations').insert({ name, email, phone: phone || null, guests: Number(guests), reservation_date, reservation_time, occasion: occasion || null, notes: notes || null, status: 'confirmed' }).select().single();
          if (!error && data) return res.status(201).json(data);
        } catch (dbErr) {}
      }
      const newReservation = {
        id: Math.floor(1000 + Math.random() * 9000),
        name,
        email,
        phone: phone || null,
        guests: Number(guests),
        reservation_date,
        reservation_time,
        occasion: occasion || null,
        notes: notes || null,
        status: 'confirmed',
        created_at: new Date().toISOString(),
      };
      localReservations.push(newReservation);
      return res.status(201).json(newReservation);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      if (supabase) {
        try {
          const { error } = await supabase.from('reservations').delete().eq('id', id);
          if (!error) return res.status(200).json({ ok: true });
        } catch (dbErr) {}
      }
      localReservations = localReservations.filter((r) => r.id !== id);
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
