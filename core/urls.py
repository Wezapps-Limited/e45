from django.contrib import admin
from django.urls import path

from .views import *

urlpatterns = [
    path('', home, name='home'),
    path('create_meeting/', create_meeting, name='create_meeting'),
    path('login/', login_user, name='login')
]
