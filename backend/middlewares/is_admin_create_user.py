from django.http import JsonResponse
from rest_framework import status

class IsAdminCreateUser:
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        path = request.path
        method = request.method

        # Block POST requests to the user registration endpoint
        if path == '/api/v001/auth/users/' and method == 'POST':
            return JsonResponse({"error": "User registration is disabled."}, status=status.HTTP_403_FORBIDDEN)

        return self.get_response(request)
