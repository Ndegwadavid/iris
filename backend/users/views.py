from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from .serializers import CustomTokenObtainPairSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
    def post (self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            print("Tokens Obtained")
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')
            
            response.set_cookie(
                key=settings.AUTH_COOKIE,
                value=access_token,
                max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE,
                secure=settings.AUTH_COOKIE_SECURE,
            )
            
            response.set_cookie(
                key="refresh",
                value=refresh_token,
                max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE,
                secure=settings.AUTH_COOKIE_SECURE,
            )
            
        return response

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request,  *args, **kwargs):
        
        refresh_token = request.COOKIES.get('refresh')
        
        if refresh_token:
            request.data['refresh'] = refresh_token
            
        response = super().post(request, *args, **kwargs)
        
        
        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')
            
            response.set_cookie(
                key=settings.AUTH_COOKIE,
                value=access_token,
                max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE,
                secure=settings.AUTH_COOKIE_SECURE,
            )
            
            response.set_cookie(
                key="refresh",
                value=refresh_token,
                max_age=settings.AUTH_COOKIE_ACCESS_MAX_AGE,
                path=settings.AUTH_COOKIE_PATH,
                httponly=settings.AUTH_COOKIE_HTTP_ONLY,
                samesite=settings.AUTH_COOKIE_SAMESITE,
                secure=settings.AUTH_COOKIE_SECURE,
            )
            
        return response
        
        

class CustomTokenVerifyView(TokenVerifyView):
    def post(self, request, *args, **kwargs):
        access_token = request.COOKIES.get(settings.AUTH_COOKIE)
        
        if access_token:
            request.data['token'] = access_token
        return super().post(request, *args, **kwargs)
    
    
class SignOutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        response = Response({"m": "signed out successfuly "}, status=status.HTTP_200_OK)
        response.delete_cookie(settings.AUTH_COOKIE)
        response.delete_cookie('refresh')
        return response