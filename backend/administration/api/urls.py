from django.urls import path
from .views import SystemInfo, AdminDashboardSummaryView, AdminStaffManagementAPIView, AdminBranchManagementAPIView, AdminClientManagementAPIView

urlpatterns = [
    path('system-info/', SystemInfo.as_view(), name='system-info'),
    path('dashboard-summary/', AdminDashboardSummaryView.as_view(), name='admin-dashboard-summary'),
    path('staff/', AdminStaffManagementAPIView.as_view(), name='staff-admin-list'),
    path('staff/<uuid:user_id>/', AdminStaffManagementAPIView.as_view(), name='staff-admin-detail'),
    path('branches/', AdminBranchManagementAPIView.as_view(), name='branch-list'),
    path('branches/<str:branch_id>/', AdminBranchManagementAPIView.as_view(), name='branch-detail'), 
    path('clients/', AdminClientManagementAPIView.as_view(), name='client-list'), 
    path('clients/<uuid:client_id>/', AdminClientManagementAPIView.as_view(), name='client-detail'), 

]
