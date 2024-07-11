from django.urls import path
from applications.views import JobApplicationList,JobApplicationDetail,CompanyDetailAPIView,CompanyListCreateAPIview,CustomTokenRefreshView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView  # type: ignore
from .views import LoginView, registration_view, logout_view



urlpatterns = [

  path('signup/',registration_view, name='signup'),
  path('login/', LoginView.as_view() ,name='login'),
  path('logout/',  logout_view ,name='logout'),
  path('applications/',JobApplicationList.as_view(),name='applications'),
  path('applications/<int:pk>',JobApplicationDetail.as_view(),name='application_detail'),
  path('companies/', CompanyListCreateAPIview.as_view(),name = 'company-list-create'),
  path('companies/<int:pk>/', CompanyDetailAPIView.as_view(),name = 'company-detail' ),
  path('api/token/',TokenObtainPairView.as_view(),name='token_obtain_pair'),
  path('api/token/refresh/',CustomTokenRefreshView.as_view(),name='token_refresh'),
]