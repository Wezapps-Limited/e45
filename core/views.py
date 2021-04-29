import requests

from django.conf import settings
from django.contrib import messages
from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required


@login_required(login_url='login')
def home(request):
    return render(request, 'home.html', {})


@login_required(login_url='login')
def create_meeting(request):
    username = request.user.username
    req = requests.post(f'{settings.NODE_SERVER_URL}/create_meeting', params={"username": username})
    response = req.json()
    return redirect(settings.NODE_SERVER_URL+ f'/?username={username}')


def unauthentication_required(view_function):
    def wrapper(request, *args, **kwargs):
        if request.user.is_authenticated:
            return redirect('home')
        else:
            return view_function(request, *args, **kwargs)
    return wrapper


@unauthentication_required
def login_user(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.warning(request, "No such credentials")
            return redirect('login')
    return render(request, 'login.html')