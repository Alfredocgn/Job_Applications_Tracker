from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status,generics
from .serializers import UserSerializer,JobApplicationsSerializer,CompanySerializer
from .models import JobApplication,Company
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.pagination import PageNumberPagination
from .filters import JobApplicationFilter

# Create your views here.

class JobApplicationList(APIView):

  def get(self,request,*args,**kwargs):
    applications = JobApplication.objects.all().order_by('-applied_date')
    filterset = JobApplicationFilter(request.GET,queryset=applications)
    if filterset.is_valid():
      applications = filterset.qs
    paginator = PageNumberPagination()
    result_page = paginator.paginate_queryset(applications,request)
    serializer = JobApplicationsSerializer(result_page,many=True)
    return paginator.get_paginated_response(serializer.data)
  
  def post(self,request):
    serializer = JobApplicationsSerializer(data = request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data)
    else:
      return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
  

class JobApplicationDetail(APIView):

  def get(self,request,pk):
    try:
      application = JobApplication.objects.get(pk=pk)
      
    except JobApplication.DoesNotExist:
      return Response({'error':'Job application not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = JobApplicationsSerializer(application)
    return Response(serializer.data)
  
  def put(self,request,pk):
    try:
      application = JobApplication.objects.get(pk=pk)
      
    except JobApplication.DoesNotExist:
      return Response({'error':'Job application not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = JobApplicationsSerializer(application,data=request.data)

    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data)
    else:
      return Response(serializer.errors,status=status.HTTP_406_NOT_ACCEPTABLE)
    
  def delete(self,request,pk):
    try:
      application = JobApplication.objects.get(pk=pk)
      
    except JobApplication.DoesNotExist:
      return Response({'error':'Job application not found'}, status=status.HTTP_404_NOT_FOUND)
    
    application.delete()
    return Response({'Application deleted succesfully'},status=status.HTTP_204_NO_CONTENT)
    

class CompanyListCreateAPIview(generics.ListCreateAPIView):
  queryset = Company.objects.all()
  serializer_class = CompanySerializer

class CompanyDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
  queryset = Company.objects.all()
  serializer_class = CompanySerializer

# class SignUpView(generics.CreateAPIView):
#   queryset = CustomUser.objects.all()
#   permission_classes = [AllowAny]
#   serializer_class = UserSerializer

class LoginView(TokenObtainPairView):
  permission_classes = [AllowAny]
  serializer_class = TokenObtainPairSerializer

@api_view(['POST'])
def logout_view(request):
  if request.method == 'POST':
    request.user.auth_token.delete()
    return Response(status=status.HTTP_200_OK)

@api_view(['POST'])    
def registration_view(request):
  if request.method == 'POST':
    serializer = UserSerializer(data=request.data)
    data ={}
    if serializer.is_valid():
      account = serializer.save()
      data['response'] = 'User registered succesfully'
      data['username'] = account.username
      data['email'] = account.email
      refresh = RefreshToken.for_user(account)

      data['token'] = {
        'refresh':str(refresh),
        'access':str(refresh.access_token)
      }

      return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


# @api_view(['GET'])
# def applications_list(request):
#   if request.method == 'GET':
#     try:
#       applications = JobApplication.objects.all()
#       serializer = JobApplicationsSerializer(applications, many=True)
#       return Response(serializer.data, status=status.HTTP_200_OK)
      
#     except Exception as e:
#       return Response({'error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

# @api_view(['POST'])
# def add_application(request):
#     if request.method == 'POST':
#       try:
#         de_serializer = JobApplicationsSerializer(data=request.data,context={'request':request})
#         if de_serializer.is_valid():
#           de_serializer.save()
#           return Response(de_serializer.data,status=status.HTTP_201_CREATED)
#         else:
#           return Response(de_serializer.errors,status=status.HTTP_400_BAD_REQUEST)
      
#       except Exception as e:
#         return Response({'error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)

  
# @api_view(['GET','PUT','DELETE'])
# def application_detail(request,pk):
#   if request.method == 'GET':
#     try:
#       application = JobApplication.objects.get(pk=pk)
#       serializer = JobApplicationsSerializer(application)
#       return Response(serializer.data)

#     except JobApplication.DoesNotExist:
#       return HttpResponseNotFound({'error':'Job application not found'}, status=status.HTTP_404_NOT_FOUND)
    
#   if request.method == 'PUT':
#     try:
#       application = JobApplication.objects.get(pk=pk)
#       de_serializer = JobApplicationsSerializer(application,data=request.data,context={'request':request})
#       if de_serializer.is_valid():
#         de_serializer.save()
#         return Response(de_serializer.data, status=status.HTTP_200_OK)
      
#       else :
#         return Response(de_serializer.errors,status=status.HTTP_400_BAD_REQUEST)
#     except Exception as e :
#       return Response({'error':str(e)},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
#   if request.method == 'DELETE':
#       try:
#         application = JobApplication.objects.get(pk=pk)
#         application.delete()
#         data ={
#           "Result":"Application deleted succesfully"
#         }
#         return Response(data, status=status.HTTP_204_NO_CONTENT)
      
#       except JobApplication.DoesNotExist:
#         return Response({'error':'Job application does not exist'},status=status.HTTP_404_NOT_FOUND)

