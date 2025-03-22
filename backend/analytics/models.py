from django.db import models

class APIRequestLog(models.Model):
    method = models.CharField(max_length=10)  # GET, POST, PUT, PATCH, DELETE
    endpoint = models.CharField(max_length=255)  # API URL path
    count = models.IntegerField(default=0)  # Number of times this request happened
    last_requested = models.DateTimeField(auto_now=True)  # Last time this request was made
    created_at = models.DateTimeField(auto_now_add=True)  # When this log was created

    class Meta:
        unique_together = ("method", "endpoint")  # Avoid duplicates for the same method & endpoint

    def __str__(self):
        return f"{self.method} {self.endpoint} ({self.count})"
