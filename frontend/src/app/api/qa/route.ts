import { NextResponse } from 'next/server';
import { getStoredBooks } from '@/lib/books-data';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const question = (data.question || '').trim();
    if (!question) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }

    const cleanQ = question.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

    // 1. Casual Greetings & Identity Check
    const greetings = new Set([
      'hy', 'hi', 'hello', 'hey', 'hola', 'helo', 'hiii', 'hyy', 'hyyy', 'yo', 
      'greetings', 'good morning', 'good evening', 'sup', 'who are you', 'what is aura', 'help', 'menu'
    ]);

    if (greetings.has(cleanQ) || ['hi ', 'hello ', 'hey ', 'hy '].some(g => cleanQ.startsWith(g))) {
      return NextResponse.json({
        answer: 'Hello! 👋 I am Aura, your AI-powered book intelligence assistant. I can summarize books, analyze themes, recommend titles, and answer any questions about your library. What would you like to explore today?',
        sources: []
      });
    }

    // 2. Search library books context
    const books = getStoredBooks();
    const matchedBooks: any[] = [];
    const qWords = cleanQ.split(' ').filter((w: string) => w.length > 2);

    for (const b of books) {
      const titleLow = b.title.toLowerCase();
      const authorLow = b.author.toLowerCase();
      const descLow = b.description.toLowerCase();

      if (
        cleanQ.includes(titleLow) || 
        cleanQ.includes(authorLow) ||
        qWords.some((w: string) => titleLow.includes(w) || authorLow.includes(w) || descLow.includes(w))
      ) {
        matchedBooks.push(b);
      }
    }

    const relevantBooks = matchedBooks.length > 0 ? matchedBooks.slice(0, 3) : books.slice(0, 3);
    const sources = relevantBooks.map(b => `${b.title} by ${b.author}`);

    // 3. Generate answer
    const contextText = relevantBooks
      .map(b => `• ${b.title} (${b.author}): ${b.description}`)
      .join('\n\n');

    let answer = '';

    // If Groq key is set in environment, call Groq API
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey && groqKey !== 'dummy_key_for_fallback') {
      try {
        const groqResp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.1-8b-instant',
            messages: [
              {
                role: 'system',
                content: `You are Aura AI, an intelligent book intelligence assistant. Answer the user's question using the library context when relevant.\n\nContext:\n${contextText}`
              },
              { role: 'user', content: question }
            ],
            temperature: 0.5,
            max_tokens: 350
          })
        });
        if (groqResp.ok) {
          const groqData = await groqResp.json();
          answer = groqData.choices?.[0]?.message?.content || '';
        }
      } catch (err) {
        // Fallback to synthesized answer
      }
    }

    if (!answer) {
      const topBook = relevantBooks[0];
      answer = `Based on your library, **${topBook.title}** by ${topBook.author} explores:\n\n${topBook.description}\n\n**Themes & Insights**: ${topBook.insights?.summary || 'A foundational literary work.'}\n\n**Recommended Reads**: ${topBook.insights?.recommendations?.join(', ') || 'Pride and Prejudice, Frankenstein'}`;
    }

    return NextResponse.json({
      answer,
      sources
    });
  } catch (err: any) {
    return NextResponse.json({
      answer: 'I am Aura AI. How can I assist you with your library today?',
      sources: []
    });
  }
}
