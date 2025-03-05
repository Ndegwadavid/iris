from django.contrib import admin
from .models import Client, Examination

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'phone_number','visit_count', 'last_examination_date','registered_by','created_at') 
    search_fields = ('first_name', 'last_name', 'email', 'phone_number') 
    list_filter = ('created_at',)  
    ordering = ('-created_at',)  

@admin.register(Examination)
class ExaminationAdmin(admin.ModelAdmin):
    list_display = ('client', 'examination_date', 'examined_by', 'state')
    search_fields = ('client__first_name', 'client__last_name', 'examined_by')
    list_filter = ('state', 'examination_date')
    ordering = ('-created_at',)

