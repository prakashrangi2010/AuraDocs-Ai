import { NextResponse } from 'next/server';
import { addStoredBook } from '@/lib/books-data';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const url = data.url;
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Attempt to fetch title from URL
    let title = 'Web Document Reference';
    let author = 'Featured Author';
    let description = `Reference material extracted from ${url}.`;
    const cover_image_url = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop';

    try {
      const resp = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(4000) });
      if (resp.ok) {
        const html = await resp.text();
        const ogTitleMatch = html.match(/<meta property=["']og:title["'] content=["'](.*?)["']/i);
        if (ogTitleMatch && ogTitleMatch[1]) title = ogTitleMatch[1];
        const ogDescMatch = html.match(/<meta property=["']og:description["'] content=["'](.*?)["']/i);
        if (ogDescMatch && ogDescMatch[1]) description = ogDescMatch[1];
      }
    } catch (e) {
      // Use fallback metadata
    }

    const newBook = addStoredBook({
      title,
      author,
      rating: '4.8',
      description,
      url,
      cover_image_url,
      insights: {
        summary: description.slice(0, 150) + '...',
        genre: 'Digital Library Document',
        recommendations: ['Pride and Prejudice', 'Frankenstein']
      }
    });

    return NextResponse.json({
      book: newBook,
      insights: newBook.insights
    }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
