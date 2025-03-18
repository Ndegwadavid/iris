from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from ..models import Client, Examination, Sales, Branch
from .serializers import ClientRegistrationSerializer, ExaminationSerializer, SalesSerializer, BranchSerializer
from datetime import date
from django.db.models import Q
# added this line for cleint please look in to it 
from .serializers import ClientSerializer



class BranchListAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        branches = Branch.objects.all()
        serializer = BranchSerializer(branches, many=True)
        return Response(serializer.data)



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
                    "booked": 'true'
                }, status=status.HTTP_201_CREATED)
        return Response(
            {
                "error": serializer.errors,
                "booked": 'false'
            }, status=status.HTTP_400_BAD_REQUEST)


class RegisterClientExaminationView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, id, *args, **kwargs):
        examination = get_object_or_404(Examination, id=id) 
        examined_by = f"Dr. {request.user.first_name} {request.user.last_name}"
        serializer = ExaminationSerializer(examination, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(examined_by=examined_by, state="Completed")
            client = examination.client
            client.last_examination_date = date.today()
            client.save()
            return Response(
                {
                    "message": "Examination added successfully",
                    "booked_for_sales" : 'true'
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
    
    def get(self, request, id, *args, **kwargs):
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
                "message": "Client booked for examination",

            },
            status=status.HTTP_201_CREATED
        )


class GetBookedClientForSalesAPIView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        search_query = request.query_params.get("search", "").strip()

        if search_query:
            booked_clients = Examination.objects.filter(
                booked_for_sales=True
            ).filter(
                Q(client__first_name__icontains=search_query) |  
                Q(client__reg_no__icontains=search_query)  
            )
        else:
            booked_clients = Examination.objects.filter(booked_for_sales=True)

        serializer = ExaminationSerializer(booked_clients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SearchClientView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        query = request.query_params.get("q", "").strip()
        if query:
            clients = Client.objects.filter(
                Q(first_name__icontains=query) | 
                Q(last_name__icontains=query) | 
                Q(phone_number__icontains=query) | 
                Q(email__icontains=query)
            )
        else:
            clients = Client.objects.all()  # added this line for returning all cleitns if search is not supplied with cleitns name
        if not clients.exists():
            return Response(
                {"message": "No clients found."}, 
                status=status.HTTP_404_NOT_FOUND
            )
        serializer = ClientSerializer(clients, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class SalesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, sales_id=None, *args, **kwargs):
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
        query = request.query_params.get("q", "").strip()  
        if not query:
            return Response(
                {"error": "Please provide a search query (name or registration number)."},
                status=status.HTTP_400_BAD_REQUEST
            )

        sales = Sales.objects.filter(
            Q(examination__client__first_name__icontains=query) |
            Q(examination__client__reg_no__icontains=query)
        )

        if not sales.exists():
            return Response(
                {"message": "Client not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        outstanding_sales = sales.filter(balance_due__gt=0)

        if not outstanding_sales.exists():
            return Response(
                {"message": "Client found, but balance is fully paid."},
                status=status.HTTP_200_OK
            )

        serializer = SalesSerializer(outstanding_sales, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



class PendingExaminationsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        examinations = Examination.objects.filter(state="Pending")
        serializer = ExaminationSerializer(examinations, many=True)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)
    
## retieve client view
class RetrieveClientView(APIView):
    def get(self, request, id):
        try:
            client = Client.objects.get(id=id)
            serializer = ClientSerializer(client)
            return Response(serializer.data)
        except Client.DoesNotExist:
            return Response({"error": "Client not found"}, status=404)
        

class GenerateReceiptView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, sales_id):
        sale = get_object_or_404(Sales, id=sales_id)
        examination = sale.examination
        client = examination.client
        
        receipt = {
            "client": {
                "name": f"{client.first_name} {client.last_name}",
                "registration_number": client.reg_no,
                "phone_number": client.phone_number,
                "email": client.email,
                "visit_count": client.visit_count,
                "last_examination_date": client.last_examination_date,
            },
            "examination": {
                "date": examination.examination_date,
                "status": examination.state,
                "examined_by": examination.examined_by,
            },
            "sales": {
                "payment_method": sale.payment_method,
                "served_by": sale.served_by,
                "total_amount": sale.total_price,
                "amount_paid": sale.advance_paid,
                "balance_due": sale.balance_due,
                "advance_payment_status": sale.advance_payment_status,
                "balance_payment_status": sale.balance_payment_status,
                "order_status": sale.order_paid,
                "mpesa_transaction_code": sale.mpesa_transaction_code,
                "created_at": sale.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                "frame": {
                    "brand": sale.frame_brand,
                    "model": sale.frame_model,
                    "color": sale.frame_color,
                    "quantity": sale.frame_quantity,
                    "price": sale.frame_price,
                },
                "lens": {
                    "brand": sale.lens_brand,
                    "type": sale.lens_type,
                    "material": sale.lens_material,
                    "coating": sale.lens_coating,
                    "quantity": sale.lens_quantity,
                    "price": sale.lens_price,
                },
            }
        }
        
        return Response(receipt, status=status.HTTP_200_OK)


# Gets client  based on id the  and client all examinations
class SingleClientInfoView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request,client_id=None, *args, **kwargs):
        client = get_object_or_404(Client, id=client_id)
        client_data = ClientSerializer(client).data
        examinations = client.examinations.all()
        examinations_data = ExaminationSerializer(examinations, many=True).data
       
        
        return Response({
            "client": client_data,
            "examinations" : examinations_data
        }, status=status.HTTP_201_CREATED)