from django.utils.timezone import now
from analytics.models import APIRequestLog

class APIRequestLoggerMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if request.path.startswith("/api/"):  # Only track API requests
            method = request.method
            endpoint = request.path

            # Update or create log entry
            log, created = APIRequestLog.objects.get_or_create(method=method, endpoint=endpoint)
            log.count += 1
            log.last_requested = now()
            log.save()

        return response 