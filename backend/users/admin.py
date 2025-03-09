from django.contrib import admin
from .models import UserAccount

@admin.register(UserAccount)
class UserAccountAdmin(admin.ModelAdmin):
    list_display = ("email", "first_name", "last_name", "role", "is_active", 'is_superuser')
    list_filter = ("role", "is_active")
    search_fields = ("email", "first_name", "last_name", "role")
    ordering = ("email",)
