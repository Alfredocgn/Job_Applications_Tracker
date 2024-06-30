from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore
from rest_framework.response import Response
from rest_framework import status
from applications.models import JobApplication, CustomUser



class JobApplicationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = "__all__"

class UserSerializer(serializers.ModelSerializer):
    applicationslist = JobApplicationsSerializer(many=True,read_only=True)
    class Meta:
        model = CustomUser
        fields = ['uuid','email','first_name','last_name','password','is_active','username']
        extra_kwargs = {
            'uuid':{'read_only':True},
            'password':{'write_only':True},
            'username':{'required':False},
            }
    
    def create(self,validated_data):
        if validated_data.get('is_superuser',False):
            user = CustomUser.objects.create_superuser(
              email = validated_data['email'],
              first_name = validated_data['first_name'],
              last_name = validated_data['last_name'],            
            )
            user.set_password(validated_data['password'])
        else :
          user = CustomUser.objects.create_user(
              email = validated_data['email'],
              first_name = validated_data['first_name'],
              last_name = validated_data['last_name'],
              username = validated_data['username']
          )
          user.set_password(validated_data['password'])
        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    token = serializers.CharField(read_only=True)

    def validate(self,data):
        email = data.get('email')
        password = data.get('password')
        if email and password:
          user = authenticate(email=email,password=password)
          if not user:
              raise serializers.ValidationError('Unable to log in with provided credential')
          if not user.is_active:
              raise serializers.ValidationError('User account is disabled')
          
          refresh = RefreshToken.for_user(user)

          token_data= {
              'refresh':str(refresh),
              'access':str(refresh.access_token)
          }
          print(token_data)
          return Response(token_data,status=status.HTTP_200_OK)
        else:
            raise serializers.ValidationError('Must include email and password')
        



# Puedo agregar funciones validadoras dentro de la clase que se llame validate y la toma por defecto o que se llame validate_(campo que quiero validar)
# Tambien puedo crear un serializerMethodFIeld para tener la info especifica de un field o algo y le agrego el nombre a la funcion con un get_longitud_direccion
# dentro de la clase.
# Se usa ModelSerializer porque mapea automaticamente todos los elementos del modelo sin tener que escribrilos como en el caso de serializers.Serializer
# class JobApplicationsSerializer(serializers.Serializer):
#     id = serializers.IntegerField(read_only = True)
#     title = serializers.CharField()
#     company = serializers.CharField()
#     status = serializers.CharField()
#     applied_date = serializers.DateField()
#     response_date = serializers.DateField(required=False,allow_null=True)
#     interview_date = serializers.DateField(required=False,allow_null=True)
#     description_job = serializers.CharField(required=False,allow_null=True)
#     user = serializers.PrimaryKeyRelatedField(read_only=True)

#     def create(self,validated_data):
#         request = self.context.get('request')
#         user = request.user
#         return JobApplication.objects.create(user=user,**validated_data)
    
#     def update(self,instance,validated_data):
#         instance.status = validated_data.get('status',instance.status)
#         instance.response_date = validated_data.get('response_date',instance.response_date)
#         instance.interview_date = validated_data.get('interview_date',instance.interview_date)
#         instance.description_job = validated_data.get('description_job',instance.description_job)
#         instance.save()
#         return instance