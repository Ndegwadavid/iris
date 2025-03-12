from django.urls import path
from ..views import CustomTokenObtainPairView, CustomTokenRefreshView, TokenVerifyView, SignOutView


urlpatterns = [
    path('staff/login/', CustomTokenObtainPairView.as_view(), name='staff_login'),
    path('jwt/create/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('jwt/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('jwt/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('signout/', SignOutView.as_view(), name='signout'),
    
]
