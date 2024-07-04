from django.urls import path
from applications.views import JobApplicationList,JobApplicationDetail
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import LoginView, registration_view, logout_view



urlpatterns = [

  path('signup/',registration_view, name='signup'),
  path('login/', LoginView.as_view() ,name='login'),
  path('logout/',  logout_view ,name='logout'),
  path('applications/',JobApplicationList.as_view(),name='applications'),
  path('applications/new',JobApplicationList.as_view(),name='new_applications'),
  path('applications/<int:pk>',JobApplicationDetail.as_view(),name='application_detail'),
  # path('api/token/',TokenObtainPairView.as_view(),name='token_obtain_pair'),
  # path('api/token/refresh/',TokenRefreshView.as_view(),name='token_refresh'),
]