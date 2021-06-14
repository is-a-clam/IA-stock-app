import json
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from rest_framework import generics, permissions
from .serializers import RegisterSerializer
from graph.models import UserProfile

@ensure_csrf_cookie
def loginSetCookie(request):
    return JsonResponse({"details": "CSRF cookie set"})

class RegisterView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    queryset = UserProfile.objects.all()
    serializer_class = RegisterSerializer

@require_POST
def loginView(request):
    data = json.loads(request.body)
    username = data.get("username")
    password = data.get("password")
    if username is None or password is None:
        return JsonResponse(
            {"error": "Please enter both username and password"},
            status=400,
        )
    print("username: " + username + " password: " + password)
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({"detail": "Login Successful"})
    return JsonResponse({"detail": "Invalid credentials"}, status=400)

@require_POST
def logoutView(request):
    logout(request)
    return JsonResponse({"detail": "Logout Successful"})
