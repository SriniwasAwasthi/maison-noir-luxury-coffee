import supabase from './db-client.js';
import { initialReviews } from './mock-data.js';

let localReviews = [...initialReviews];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'GET') {
      if (supabase) {
        try {
          const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false }).limit(50);
          if (!error && data && data.length > 0) {
            return res.status(200).json(data);
          }
        } catch (dbErr) {
          // fallback
        }
      }
      return res.status(200).json(localReviews);
    }
    if (req.method === 'POST') {
      const { name, rating, title, comment } = req.body || {};
      if (!name || !rating || !comment) return res.status(400).json({ error: 'Name, rating and comment are required' });
      const r = Number(rating);
      if (r < 1 || r > 5) return res.status(400).json({ error: 'Rating must be between 1 and 5' });
      if (supabase) {
        try {
          const { data, error } = await supabase.from('reviews').insert({ name, rating: r, title: title || null, comment }).select().single();
          if (!error && data) return res.status(201).json(data);
        } catch (dbErr) {
          // fallback
        }
      }
      const newReview = {
        id: Date.now(),
        name,
        rating: r,
        title: title || null,
        comment,
        created_at: new Date().toISOString(),
      };
      localReviews.unshift(newReview);
      return res.status(201).json(newReview);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
