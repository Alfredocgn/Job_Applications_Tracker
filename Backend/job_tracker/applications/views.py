from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer,LoginSerializer,JobApplicationsSerializer
from .models import JobApplication
from django.http import HttpResponseNotFound
from rest_framework.views import APIView
# Create your views here.

class JobApplicationList(APIView):

  def get(self,request):
    applications = JobApplication.objects.all()
    serializer = JobApplicationsSerializer(applications,many=True)
    return Response(serializer.data)
  
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

    if serializer.is_valid:
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
    return Response(status=status.HTTP_204_NO_CONTENT)
    

  

    

# @api_view(['POST'])
# def signup(request):
#   serializer = UserSerializer(data=request.data)
#   if serializer.is_valid():
#     serializer.save()
#     return Response(serializer.data,status=status.HTTP_201_CREATED)
#   return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


# @api_view(['POST'])
# def login(request):
#   serializer = LoginSerializer(data=request.data)
#   print('serializer data',serializer)
#   print('request data',request.data)

#   if serializer.is_valid():
#     return Response(serializer.validated_data['token'],status=status.HTTP_200_OK)
#   else :
#     print('Serializers errors', serializer.errors)
#     return Response(serializer.errors,status=status.HTTP_401_UNAUTHORIZED)

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

