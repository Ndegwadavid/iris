from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions


# Configs for API Documentation
schema_view = get_schema_view(
    openapi.Info(
        title="IRIS API Documentation",
        default_version='v1',
        description="Iris API documentation",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="peternyando254@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    
    # API Documentation Endpoints
    path('dev-doc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # API Endpoints
    path('admin/', admin.site.urls),
    path('api/v001/admin-f/', include('administration.api.urls')), # Administration app routes
    path('api/v001/analytics/', include('analytics.api.urls')), # Analytics app routes
    path('api/v001/clients/', include('clients.api.urls')), # Clients app routes
    path('api/v001/auth/', lambda request: redirect('/')), # redirect to '/'
    path('api/v001/auth/', include('djoser.urls')), # Djoser  routes
    path('api/v001/auth/', include('users.urls.jwt')), # Custom Djoser JWT auth  routes
]


