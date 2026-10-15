import { NextResponse } from 'next/server';
import { addStoredBook, getStoredBooks } from '@/lib/books-data';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const title = data.title;
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const existing = getStoredBooks().find(b => b.title.toLowerCase() === title.toLowerCase());
    if (existing) {
      return NextResponse.json({
        message: 'Book already exists in library',
        book: existing
      }, { status: 200 });
    }

    const newBook = addStoredBook({
      title,
      author: data.author || 'Unknown Author',
      rating: data.rating || '4.8',
      description: data.description || '',
      url: data.url || '',
      cover_image_url: data.cover_image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop',
      insights: {
        summary: `Overview: ${data.description ? data.description.slice(0, 150) : title}...`,
        genre: 'Classic Literature, Fiction',
        recommendations: ['Pride and Prejudice', 'Frankenstein']
      }
    });

    // Optionally record to Supabase
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oieliyknzedhimmegyii.supabase.co';
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_EwkB-ZHEjRpl3AhYEhU_GA_393olUfI';
      await fetch(`${supabaseUrl}/rest/v1/AuraDocs-Ai`, {
        method: 'POST',
        headers: {
          'apikey': anonKey,
          'Authorization': `Bearer ${anonKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ id: newBook.id + 100 })
      });
    } catch (err) {
      // Ignore Supabase write errors
    }

    return NextResponse.json({
      message: 'Book imported successfully!',
      book: newBook
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
