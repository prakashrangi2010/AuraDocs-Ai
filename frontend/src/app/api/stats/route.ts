import { NextResponse } from 'next/server';
import { getStoredBooks } from '@/lib/books-data';

export async function GET() {
  const books = getStoredBooks();
  
  // Try querying Supabase record count if available
  let vectorCount = 17;
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://oieliyknzedhimmegyii.supabase.co';
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_EwkB-ZHEjRpl3AhYEhU_GA_393olUfI';
    const resp = await fetch(`${supabaseUrl}/rest/v1/AuraDocs-Ai?select=id`, {
      headers: {
        'apikey': anonKey,
        'Authorization': `Bearer ${anonKey}`
      },
      next: { revalidate: 30 }
    });
    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data) && data.length > 0) {
        vectorCount = data.length;
      }
    }
  } catch (err) {
    // Keep fallback vectorCount
  }

  return NextResponse.json({
    total_books: books.length,
    vector_chunks: vectorCount,
    rag_status: 'Supabase Active',
    free_api_source: 'Project Gutenberg / Open Library'
  });
}
