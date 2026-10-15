import { NextResponse } from 'next/server';
import { getStoredBooks, addStoredBook } from '@/lib/books-data';

export async function GET() {
  const books = getStoredBooks();
  return NextResponse.json(books);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    const createdBook = addStoredBook({
      title: data.title,
      author: data.author || 'Unknown Author',
      rating: data.rating || '4.8',
      description: data.description || '',
      url: data.url || '',
      cover_image_url: data.cover_image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop'
    });
    return NextResponse.json(createdBook, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
