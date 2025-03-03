from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v001/', include('clients.api.urls')), # Clients app routes
]

