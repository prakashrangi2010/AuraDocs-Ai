from django.db import models

class Book(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255, blank=True, null=True)
    rating = models.CharField(max_length=50, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    url = models.URLField(max_length=500, blank=True, null=True)
    cover_image_url = models.URLField(max_length=1000, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
