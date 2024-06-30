from django.urls import path
from applications.views import JobApplicationList,JobApplicationDetail
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [

  # path('signup/',views.signup, name='signup'),
  # path('login/',views.login,name='login'),
  path('applications/',JobApplicationList.as_view(),name='applications'),
  path('applications/new',JobApplicationList.as_view(),name='new_applications'),
  path('applications/<int:pk>',JobApplicationDetail.as_view(),name='application_detail'),
  path('api/token/',TokenObtainPairView.as_view(),name='token_obtain_pair'),
  path('api/token/refresh/',TokenRefreshView.as_view(),name='token_refresh'),
]