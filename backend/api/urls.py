from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'books', views.BookViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('books/<int:pk>/recommendations/', views.get_recommendations, name='get_recommendations'),
    path('upload/', views.upload_book, name='upload_book'),
    path('qa/', views.qa_query, name='qa_query'),
    path('free-books/search/', views.search_free_books_view, name='search_free_books'),
    path('free-books/import/', views.import_free_book_view, name='import_free_book'),
    path('seed/', views.seed_library_view, name='seed_library'),
    path('stats/', views.library_stats_view, name='library_stats'),
]

