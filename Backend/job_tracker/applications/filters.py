from django_filters import rest_framework as filters
from .models import JobApplication

class JobApplicationFilter(filters.FilterSet):

  class Meta:
    model = JobApplication
    fields ={
      'status':['exact'],
      'applied_date':['exact','gte','lte'],
    }