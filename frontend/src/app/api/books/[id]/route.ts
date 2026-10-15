import { NextResponse } from 'next/server';
import { getStoredBooks } from '@/lib/books-data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const bookId = parseInt(resolvedParams.id, 10);
  const books = getStoredBooks();
  const book = books.find(b => b.id === bookId) || books[0];

  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  return NextResponse.json(book);
}
