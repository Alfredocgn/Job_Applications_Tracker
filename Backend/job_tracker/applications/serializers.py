from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore
from rest_framework.response import Response
from rest_framework import status
from applications.models import JobApplication, Company


User = get_user_model()

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = "__all__"


class JobApplicationsSerializer(serializers.ModelSerializer):
    company = CompanySerializer()
    class Meta:
        model = JobApplication
        fields = "__all__"
    
    def validate_company(self,value):
        if not value:
            raise serializers.ValidationError("Company field is required")
        return value 
    
    def create(self,validated_data):
        company_data = validated_data.pop('company')
        company_instance, created = Company.objects.get_or_create(**company_data)
        job_application = JobApplication.objects.create(company = company_instance, **validated_data)
        return job_application

class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type':'password'}, write_only = True)

    class Meta:
        model = User
        fields = ['id','email','first_name','last_name','password','is_active','username','password2']
        extra_kwargs = {
            'uuid':{'read_only':True},
            'password':{'write_only':True},
            'username':{'required':False},
            }
    
    def create(self,validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
    def save(self):
        password = self.validated_data['password']
        password2= self.validated_data['password2']

        if password != password2:
            raise serializers.ValidationError({'error': 'Password does not match'})
        if User.objects.filter(email = self.validated_data['email']).exists():
            raise serializers.ValidationError({'error':'Email already exists'})
        
        account = User(
            email = self.validated_data['email'],
            username = self.validated_data['username'],
            first_name = self.validated_data['first_name'],
            last_name = self.validated_data['last_name'],

            )
        account.set_password(password)
        account.save()
        return account





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