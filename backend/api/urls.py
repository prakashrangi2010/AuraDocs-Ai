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
]
