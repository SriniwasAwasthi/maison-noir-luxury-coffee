import supabase from './db-client.js';
import { initialMenuItems } from './mock-data.js';

let localMenuItems = [...initialMenuItems];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  try {
    if (req.method === 'GET') {
      const { category, featured, search } = req.query || {};
      if (supabase) {
        try {
          let query = supabase.from('menu_items').select('*').order('is_featured', { ascending: false }).order('price', { ascending: true });
          if (category && category !== 'All') query = query.eq('category', category);
          if (featured === 'true') query = query.eq('is_featured', true);
          if (search) query = query.ilike('name', '%' + search + '%');
          const { data, error } = await query;
          if (!error && data && data.length > 0) {
            return res.status(200).json(data);
          }
        } catch (dbErr) {
          // fallback
        }
      }

      let filtered = [...initialMenuItems];
      if (category && category !== 'All') {
        filtered = filtered.filter((i) => i.category.toLowerCase() === category.toLowerCase());
      }
      if (featured === 'true') {
        filtered = filtered.filter((i) => i.is_featured);
      }
      if (search && search.trim()) {
        const s = search.toLowerCase();
        filtered = filtered.filter((i) => i.name.toLowerCase().includes(s) || (i.description && i.description.toLowerCase().includes(s)));
      }
      return res.status(200).json(filtered);
    }

    if (req.method === 'POST') {
      const { name, description, price, category, image_url, is_featured, badge } = req.body || {};
      if (!name || !price || !category) return res.status(400).json({ error: 'name, price and category are required' });
      if (supabase) {
        try {
          const { data, error } = await supabase.from('menu_items').insert({ name, description, price, category, image_url, is_featured: !!is_featured, badge: badge || null }).select().single();
          if (!error && data) return res.status(201).json(data);
        } catch (dbErr) {
          // fallback
        }
      }
      const newItem = {
        id: Date.now(),
        name,
        description: description || null,
        price: Number(price),
        category,
        image_url: image_url || null,
        is_featured: !!is_featured,
        badge: badge || null,
      };
      localMenuItems.push(newItem);
      return res.status(201).json(newItem);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
