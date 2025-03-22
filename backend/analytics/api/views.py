from django.db import connection
from django.db.models import Count, Sum
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from clients.models import Client, Sales
from ..models import APIRequestLog

class APIRequestLogView(APIView):
    def get(self, request):
        logs = APIRequestLog.objects.all().order_by("-last_requested")
        data = [
            {
                "method": log.method,
                "endpoint": log.endpoint,
                "count": log.count,
                "last_requested": log.last_requested,
                "created_at": log.created_at,
            }
            for log in logs
        ]
        return Response(data, status=status.HTTP_200_OK)


class AnalyticsView(APIView):
    def get(self, request):
        # Detect the database engine
        db_engine = connection.settings_dict["ENGINE"]

        # Use DATE_TRUNC for PostgreSQL, strftime for SQLite
        if "postgresql" in db_engine:
            month_trunc = "DATE_TRUNC('month', created_at)"
        else:
            month_trunc = "strftime('%Y-%m', created_at)"

        # Total clients per branch
        clients_per_branch = (
            Client.objects.values("branch").annotate(total=Count("id")).order_by("-total")
        )

        # Total sales per branch
        sales_per_branch = (
            Sales.objects.values("examination__client__branch")
            .annotate(total_sales=Count("id"), revenue=Sum("total_price"))
            .order_by("-total_sales")
        )

        # Sales distribution by payment method
        sales_by_payment_method = (
            Sales.objects.values("payment_method")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        # Gender distribution of clients
        gender_distribution = (
            Client.objects.values("gender").annotate(count=Count("id"))
        )

        # Monthly sales trends (Cross-Compatible)
        monthly_sales = (
            Sales.objects.extra({"month": month_trunc})
            .values("month")
            .annotate(total_sales=Count("id"), revenue=Sum("total_price"))
            .order_by("month")
        )

        return Response(
            {
                "clients_per_branch": list(clients_per_branch),
                "sales_per_branch": list(sales_per_branch),
                "sales_by_payment_method": list(sales_by_payment_method),
                "gender_distribution": list(gender_distribution),
                "monthly_sales": list(monthly_sales),
            },
            status=status.HTTP_200_OK,
        )
