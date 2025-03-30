import psutil
import datetime
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAdminUser
from django.db import connections
from django.db.utils import OperationalError
from clients.models import Client, Examination, Sales, Branch
from users.models import UserAccount
from datetime import datetime, timedelta
from django.utils.timezone import now
from django.contrib.auth import get_user_model
from .serializers import UserAccountSerializer
from django.db.models import Q
from clients.api.serializers import BranchSerializer, ClientSerializer
from django.shortcuts import get_object_or_404


UserAccount = get_user_model()

from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
import psutil
import datetime
from django.db import connections, OperationalError

class SystemInfo(APIView):
    def get(self, request, *args, **kwargs):
        try:
            # CPU Usage
            cpu_usage = psutil.cpu_percent(interval=1)

            # Memory Usage
            memory_info = psutil.virtual_memory()
            memory_usage = memory_info.percent

            # Disk Usage
            disk_info = psutil.disk_usage('/')
            disk_usage = disk_info.percent

            # Uptime Calculation
            boot_time = datetime.datetime.fromtimestamp(psutil.boot_time())
            uptime_seconds = (datetime.datetime.now() - boot_time).total_seconds()
            uptime_hours = round(uptime_seconds / 3600, 2)  # Convert seconds to hours

            # Database Connection Check
            try:
                connections["default"].cursor()
                db_status = "Connected"
            except OperationalError:
                db_status = "Database Unreachable"

            # System Status
            system_status = "All Systems Operational" if cpu_usage < 80 and memory_usage < 80 and disk_usage < 80 else "Degraded Performance"

            return Response(
                {
                    "server_status": "Server Up",
                    "system_status": system_status,
                    "CPU": f"{cpu_usage}%",
                    "Memory": f"{memory_usage}%",
                    "Disk": f"{disk_usage}%",
                    "Uptime": f"{uptime_hours} hours",
                    "Database": db_status
                },
                status=status.HTTP_200_OK
            )
        
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )




class AdminDashboardSummaryView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request, *args, **kwargs):
        # Date Ranges
        today = now().date()
        start_of_week = today - timedelta(days=today.weekday())  # Monday
        start_of_month = today.replace(day=1)

        # Total Counts
        total_clients = Client.objects.count()
        total_examinations = Examination.objects.count()
        total_staff = UserAccount.objects.filter(is_staff=True, is_active=True).count()
        total_sales = Sales.objects.count()
        total_branches = Branch.objects.count()

        # Query by Date Ranges
        today_clients = Client.objects.filter(created_at__date=today).count()
        week_clients = Client.objects.filter(created_at__date__gte=start_of_week).count()
        month_clients = Client.objects.filter(created_at__date__gte=start_of_month).count()

        today_exams = Examination.objects.filter(created_at__date=today).count()
        week_exams = Examination.objects.filter(created_at__date__gte=start_of_week).count()
        month_exams = Examination.objects.filter(created_at__date__gte=start_of_month).count()

        today_sales = Sales.objects.filter(created_at__date=today).count()
        week_sales = Sales.objects.filter(created_at__date__gte=start_of_week).count()
        month_sales = Sales.objects.filter(created_at__date__gte=start_of_month).count()

        data = {
            "message": "Manage your optical business with ease",
            "total_clients": total_clients,
            "total_examinations": total_examinations,
            "total_staff": total_staff,
            "total_sales": total_sales,
            "total_branches": total_branches,
            "filters": {
                "today": {
                    "clients": today_clients,
                    "examinations": today_exams,
                    "sales": today_sales,
                },
                "this_week": {
                    "clients": week_clients,
                    "examinations": week_exams,
                    "sales": week_sales,
                },
                "this_month": {
                    "clients": month_clients,
                    "examinations": month_exams,
                    "sales": month_sales,
                },
            }
        }

        return Response(data, status=status.HTTP_200_OK)





class AdminStaffManagementAPIView(APIView):
    permission_classes = [IsAdminUser]  

    def get(self, request, user_id=None):
        """
        Retrieve all users or a single user by ID.
        Supports filtering users by role using ?role=<role> and name using ?name=<name>.
        """
        if user_id:
            try:
                user = UserAccount.objects.get(id=user_id)
                serializer = UserAccountSerializer(user)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except UserAccount.DoesNotExist:
                return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Filtering users by role and name
        query = request.query_params.get("query")

        users = UserAccount.objects.all()

        if query:
            users = users.filter(Q(role__icontains=query) | Q(first_name__icontains=query))

        serializer = UserAccountSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = UserAccountSerializer(data=request.data)
        if serializer.is_valid():
            user = UserAccount.objects.create_user(**serializer.validated_data)
            return Response(UserAccountSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, user_id):
        try:
            user = UserAccount.objects.get(id=user_id)
        except UserAccount.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserAccountSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, user_id):
        try:
            user = UserAccount.objects.get(id=user_id)
            user.delete()
            return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except UserAccount.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


class AdminBranchManagementAPIView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request, branch_id=None):
        """
        Retrieve all branches or a single branch by ID.
        """
        if branch_id:
            branch = get_object_or_404(Branch, id=branch_id)
            serializer = BranchSerializer(branch)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        branches = Branch.objects.all()
        serializer = BranchSerializer(branches, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = BranchSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, branch_id):
        branch = get_object_or_404(Branch, id=branch_id)
        serializer = BranchSerializer(branch, data=request.data, partial=True)  
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, branch_id):
        branch = get_object_or_404(Branch, id=branch_id)
        branch.delete()
        return Response({"message": "Branch deleted successfully"}, status=status.HTTP_204_NO_CONTENT)



class AdminClientManagementAPIView(APIView):
    permission_classes = [IsAdminUser]  

    def get(self, request, client_id=None):
        """
        Retrieve all clients or filter by ID, reg_no, or first_name.
        """
        if client_id:
            client = get_object_or_404(Client, id=client_id)
            serializer = ClientSerializer(client)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Get query parameters
        query = request.query_params.get("query")

        # Apply filtering if parameters are provided
        clients = Client.objects.all()
        
        if query:
            clients = clients.filter(Q(reg_no__icontains=query) | Q(first_name__icontains=query))  

        serializer = ClientSerializer(clients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def patch(self, request, client_id):
        client = get_object_or_404(Client, id=client_id)
        serializer = ClientSerializer(client, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, client_id):
        client = get_object_or_404(Client, id=client_id)
        client.delete()
        return Response({"message": "Client deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
