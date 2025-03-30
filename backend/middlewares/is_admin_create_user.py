from django.http import JsonResponse
from rest_framework import status

class IsAdminCreateUser:
    def __init__(self, get_response):
        self.get_response = get_response
        
    def __call__(self, request):
        return self.get_response(request)
