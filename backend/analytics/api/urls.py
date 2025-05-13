from django.urls import path
from .views import AnalyticsView, APIRequestLogView


urlpatterns = [
    path("all/", AnalyticsView.as_view(), name="analytics"),
    path("request-logs/", APIRequestLogView.as_view(), name="api-request-logs"),
]
