import json
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.shortcuts import render, get_object_or_404
from rest_framework import generics, permissions, views, response, authentication
from .serializers import RegisterSerializer
from graph.models import UserProfile

@ensure_csrf_cookie
def loginSetCookie(request):
    return JsonResponse({"details": "CSRF cookie set"})

class registerView(generics.CreateAPIView):
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
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({"detail": "Login Successful"})
    return JsonResponse({"detail": "Invalid credentials"}, status=400)

@require_POST
def logoutView(request):
    logout(request)
    return JsonResponse({"detail": "Logout Successful"})

class deleteUserView(generics.DestroyAPIView):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        return get_object_or_404(UserProfile.objects.all(), user=user)

    def delete(self, request, *args, **kwargs):
        result = super().delete(request, *args, **kwargs)

        # Delete user account
        user = self.request.user
        user.delete()

        return result

class changePasswordView(views.APIView):
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        newPassword = request.data['password']
        currUser = request.user
        currUser.set_password(newPassword)
        currUser.save()

        return response.Response({"status": "Success"})
