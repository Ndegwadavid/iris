from django.contrib import admin
from .models import APIRequestLog

@admin.register(APIRequestLog)
class APIRequestLogAdmin(admin.ModelAdmin):
    list_display = ("method", "endpoint", "count", "last_requested", "created_at")
    list_filter = ("method",)
    search_fields = ("endpoint",)
    ordering = ("-last_requested",)
