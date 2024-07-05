from django.contrib import admin
from .models import CustomUser,JobApplication,Company

# Register your models here.

admin.site.register(CustomUser)
admin.site.register(JobApplication)
admin.site.register(Company)