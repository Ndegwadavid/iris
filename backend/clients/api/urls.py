from django.urls import path
from .views import RegisterClientView, RegisterClientExaminationView, RetrievAllExaminations, RetrieveClientExaminations,BookExistingCientForExamination, SearchClientView

app_name = "clients"

urlpatterns = [
    path('register/', RegisterClientView.as_view(), name="register_client"),
    path('examination/<uuid:id>/register/', RegisterClientExaminationView.as_view(), name="register_examination"),
    path('examinations/', RetrievAllExaminations.as_view(), name="all_examinations"),
    path('examinations/<uuid:id>/', RetrieveClientExaminations.as_view(), name="client_examinations"),
    path('examination/<uuid:id>/book/', BookExistingCientForExamination.as_view(), name="book_existing_client"),
    path('search/', SearchClientView.as_view(), name='search_client')
]


