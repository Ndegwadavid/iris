from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from ..models import Client, Examination, Sales
from .serializers import ClientRegistrationSerializer, ExaminationSerializer, SalesSerializer
from datetime import date
from django.db.models import Q


class RegisterClientView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        receptionist_name = f"{request.user.first_name} {request.user.last_name}"
        serializer = ClientRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(registered_by=receptionist_name) 
            Examination.objects.create(client=serializer.instance)
            return Response(
                {
                    "message": "client registered",
                    "booked" : 'true'
                
                }, status=status.HTTP_201_CREATED)
        return Response(
            {
                "error": serializer.errors,
                "booked" : 'false'
            }, status=status.HTTP_400_BAD_REQUEST)
        

class RegisterClientExaminationView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, id, *args, **kwargs):
        examination = get_object_or_404(Examination, id=id) 
        examined_by = f"{request.user.first_name} {request.user.last_name}"
        
        serializer = ExaminationSerializer(examination, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(examined_by=examined_by, state="Completed")
            
            # Update last_examination_date in the Client model
            client = examination.client
            client.last_examination_date = date.today()
            client.save()
            
            return Response(
                {
                    "message": "Examination added successfully",
                },
                status=status.HTTP_200_OK
            )

        return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    
class RetrievAllExaminations(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        examinations = Examination.objects.all()
        serializer = ExaminationSerializer(examinations, many=True)
        return Response({"d": serializer.data}, status=status.HTTP_200_OK)
    
    
class RetrieveClientExaminations(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, id, *args, **kwargs ):
        client = get_object_or_404(Client, id=id)
        examinations = client.examinations.all()
        serializer = ExaminationSerializer(examinations, many=True)
        return Response({"d": serializer.data}, status=status.HTTP_200_OK)
    
    
class BookExistingCientForExamination(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, id, *args, **kwargs):
        client = get_object_or_404(Client, id=id)
        Examination.objects.create(client=client)
        client.visit_count += 1
        client.save()
        
        return Response(
            {
                "message": "Client booked for examination"
                
            },
            status=status.HTTP_201_CREATED
        )
        
        
class SearchClientView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        query = request.query_params.get("q", "").strip()

        if not query:
            return Response(
                {"error": "Search query is required."}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        clients = Client.objects.filter(
            Q(first_name__icontains=query) | 
            Q(last_name__icontains=query) | 
            Q(phone_number__icontains=query) | 
            Q(email__icontains=query)
        )

        if not clients.exists():
            return Response(
                {"message": "No clients found."}, 
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = ClientRegistrationSerializer(clients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class SalesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, sales_id=None, *args, **kwargs):
        """
        Get all sales if `sales_id` is not provided.
        Get a specific sale if `sales_id` is provided.
        """
        if sales_id:
            try:
                sale = Sales.objects.get(id=sales_id)
                serializer = SalesSerializer(sale)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Sales.DoesNotExist:
                return Response({"error": "Sale not found"}, status=status.HTTP_404_NOT_FOUND)
        
        sales = Sales.objects.all()
        serializer = SalesSerializer(sales, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    
    def post(self, request):
        """ Create a new sale """
        
        request_data = request.data.copy()
        request_data['served_by'] = f"Dr. {request.user.first_name} {request.user.last_name}"

        serializer = SalesSerializer(data=request_data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                   "message": "Sale created successfully",
                }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, sales_id):
        """ Update an existing sale (pay balance or partial payment) """
        try:
            sales = Sales.objects.get(id=sales_id)
        except Sales.DoesNotExist:
            return Response({"error": "Sale not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = SalesSerializer(sales, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Sale updated successfully",
                }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SearchClientBalanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """Search for a client by name or phone number to check if they have an outstanding balance."""
        query = request.query_params.get("q", "").strip()  
        
        if not query:
            return Response({"error": "Please provide a search query (name or phone number)."}, status=status.HTTP_400_BAD_REQUEST)

        # Search for clients with outstanding balance based on name or phone
        sales = Sales.objects.filter(
            Q(booked_by__icontains=query),
            balance_due__gt=0  # Ensures only clients with unpaid balance are returned
        )

        if not sales.exists():
            return Response({"message": "No client found with an outstanding balance."}, status=status.HTTP_404_NOT_FOUND)

        serializer = SalesSerializer(sales, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
