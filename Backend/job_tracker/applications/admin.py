from django.contrib import admin
from .models import CustomUser,JobApplication

# Register your models here.

admin.site.register(CustomUser)
admin.site.register(JobApplication)