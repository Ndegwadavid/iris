from django.urls import path
from .views import(
RegisterClientView,
RegisterClientExaminationView,
RetrievAllExaminations, 
RetrieveClientExaminations,
BookExistingCientForExamination, 
SearchClientView, SalesView, 
SearchClientBalanceView,
PendingExaminationsView,
BranchListAPIView,
GetBookedClientForSalesAPIView
)

app_name = "clients"

urlpatterns = [
    path('branches/', BranchListAPIView.as_view(), name='branch-list'),
    path('register/', RegisterClientView.as_view(), name="register_client"),
    path('examination/<uuid:id>/register/', RegisterClientExaminationView.as_view(), name="register_examination"),
    path('examinations/', RetrievAllExaminations.as_view(), name="all_examinations"),
    path('examinations/<uuid:id>/', RetrieveClientExaminations.as_view(), name="client_examinations"),
    path('examination/<uuid:id>/book/', BookExistingCientForExamination.as_view(), name="book_existing_client"),
    path('examinations/pending/', PendingExaminationsView.as_view(), name="pending_examinations"), 
    path('search-booked-for-sales/', GetBookedClientForSalesAPIView.as_view(), name='get-booked-client-for-sales'),
    path('search/', SearchClientView.as_view(), name='search_client'),
    path('sales/', SalesView.as_view(), name='all-sales'), 
    path('sales/create/', SalesView.as_view(), name='create-sales'),  
    path('sales/<uuid:sales_id>/', SalesView.as_view(), name='get-sales'), 
    path('sales/<uuid:sales_id>/update/', SalesView.as_view(), name='update-sales'), 
    path('sales/search-client-balance/', SearchClientBalanceView.as_view(), name='search-client-balance'),

]


