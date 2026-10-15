import { NextResponse } from 'next/server';
import { resetStoredBooks } from '@/lib/books-data';

export async function POST() {
  const books = resetStoredBooks();
  return NextResponse.json({
    message: `Successfully seeded library with ${books.length} classic books!`,
    total_books: books.length
  });
}
