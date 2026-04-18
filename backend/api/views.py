from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Book
from .serializers import BookSerializer
from . import services

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all().order_by('-created_at') # order by latest
    serializer_class = BookSerializer

@api_view(['GET'])
def get_recommendations(request, pk):
    try:
        book = Book.objects.get(pk=pk)
    except Book.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    # Simple recommendation based on AI insights (stub)
    recommendations = [
        {"title": "Similar Book 1", "author": "Another Author"},
        {"title": "Similar Book 2", "author": "Someone Else"}
    ]
    return Response(recommendations)

@api_view(['POST'])
def upload_book(request):
    url = request.data.get('url')
    if not url:
        return Response({"error": "URL is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    # 1. Scrape book details
    book_details = services.scrape_book_details(url)
    
    # 2. Save to database
    serializer = BookSerializer(data=book_details)
    if serializer.is_valid():
        book = serializer.save()
        
        # 3. Add to RAG
        text_to_embed = f"Title: {book.title}\nAuthor: {book.author}\nDescription: {book.description}"
        services.add_to_rag(book.id, text_to_embed)
        
        # 4. Generate initial insights (sync for now)
        insights = services.generate_insights(book.description)
        
        return Response({
            "book": serializer.data,
            "insights": insights
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def qa_query(request):
    question = request.data.get('question')
    if not question:
        return Response({"error": "Question is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    answer = services.query_rag(question)
    return Response({"answer": answer})
