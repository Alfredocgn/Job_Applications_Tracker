from django.contrib.auth.models import AbstractUser
from django.contrib.auth import get_user_model
from django.db import models
import uuid

# Create your models here.

class CustomUser(AbstractUser):
    id = models.UUIDField(primary_key=True,default=uuid.uuid4,editable=False,unique=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.first_name


class Company(models.Model):
    name = models.CharField(max_length=255)
    industry = models.CharField(max_length=255,blank=True,null=True)
    location = models.CharField(max_length=255,blank=True,null=True)

    def __str__(self):
        return self.name
class JobApplication(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE,related_name='applicationslist')
    title = models.CharField(max_length=100)
    company = models.ForeignKey(Company,on_delete=models.CASCADE)
    status_choices = [
        ('NA','No Answer'),
        ('RE', 'Rejected'),
        ('IN','Interview')
    ]
    status = models.CharField(max_length=2,choices=status_choices,default='NA')
    applied_date = models.DateField()
    response_date = models.DateField(null=True,blank=True)
    interview_date = models.DateField(null=True,blank=True)
    description_job = models.CharField(max_length=500,null=True,blank=True)


    def __str__(self):
        return f"{self.title} at {self.company} ({self.get_status_display()})"


