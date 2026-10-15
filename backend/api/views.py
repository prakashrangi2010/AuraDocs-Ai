from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer
from . import services

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by('-created_at')
    serializer_class = BookSerializer

@api_view(['GET'])
def get_recommendations(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    insights = services.generate_insights(book.description)
    return Response({
        "book_id": book.id,
        "title": book.title,
        "recommendations": insights.get("recommendations", []),
        "summary": insights.get("summary", ""),
        "genre": insights.get("genre", "")
    })

@api_view(['GET'])
def search_free_books_view(request):
    query = request.GET.get('q', 'classics')
    limit = int(request.GET.get('limit', 12))
    free_books = services.search_free_books(query=query, limit=limit)
    return Response({"results": free_books, "count": len(free_books)})

@api_view(['POST'])
def import_free_book_view(request):
    data = request.data
    title = data.get('title')
    if not title:
        return Response({"error": "Title is required to import a book."}, status=status.HTTP_400_BAD_REQUEST)
    
    author = data.get('author', 'Unknown Author')
    description = data.get('description', f"Classic work: {title} by {author}.")
    cover_image_url = data.get('cover_image_url', '')
    url = data.get('url', '')
    rating = data.get('rating', '4.8')

    # Avoid duplicate titles if already imported
    existing = Book.objects.filter(title__iexact=title).first()
    if existing:
        return Response({
            "message": "Book already exists in library",
            "book": BookSerializer(existing).data
        }, status=status.HTTP_200_OK)

    serializer = BookSerializer(data={
        "title": title[:255],
        "author": author[:255],
        "rating": str(rating)[:50],
        "description": description[:10000],
        "url": url[:500],
        "cover_image_url": cover_image_url[:1000]
    })

    if serializer.is_valid():
        book = serializer.save()
        text_to_embed = f"Title: {book.title}\nAuthor: {book.author}\nDescription: {book.description}"
        services.add_to_rag(book.id, text_to_embed, metadata={"title": book.title, "author": book.author})
        insights = services.generate_insights(book.description)
        
        return Response({
            "message": "Book imported successfully!",
            "book": serializer.data,
            "insights": insights
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def upload_book(request):
    url = request.data.get('url')
    if not url:
        return Response({"error": "URL is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    book_details = services.scrape_book_details(url)
    serializer = BookSerializer(data=book_details)
    if serializer.is_valid():
        book = serializer.save()
        text_to_embed = f"Title: {book.title}\nAuthor: {book.author}\nDescription: {book.description}"
        services.add_to_rag(book.id, text_to_embed, metadata={"title": book.title, "author": book.author})
        insights = services.generate_insights(book.description)
        
        return Response({
            "book": serializer.data,
            "insights": insights
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def seed_library_view(request):
    try:
        from seed_books import seed_books
        seeded_count = seed_books()
        return Response({
            "message": f"Successfully seeded library with {seeded_count} classic books!",
            "total_books": Book.objects.count()
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def library_stats_view(request):
    total_books = Book.objects.count()
    try:
        sb = services.get_supabase_client()
        res = sb.table("AuraDocs-Ai").select("*", count="exact").execute() if sb else None
        vector_count = len(res.data) if res and res.data else len(services.supabase_chunks)
    except Exception:
        vector_count = len(services.supabase_chunks)

    return Response({
        "total_books": total_books,
        "vector_chunks": vector_count,
        "rag_status": "Supabase Active",
        "free_api_source": "Project Gutenberg / Open Library"
    })


@api_view(['POST'])
def qa_query(request):
    question = request.data.get('question')
    if not question:
        return Response({"error": "Question is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    result = services.query_rag(question)
    if isinstance(result, dict):
        return Response({
            "answer": result.get("answer", ""),
            "sources": result.get("sources", [])
        })
    return Response({"answer": str(result), "sources": []})

