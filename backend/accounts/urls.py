from django.urls import path
from . import views

app_name = "accounts"

urlpatterns = [
    path("login/", views.loginView, name="login"),
    path("login-set-cookie/", views.loginSetCookie, name="setCSRF"),
    path("logout/", views.logoutView, name="logout"),
    path("register/", views.RegisterView.as_view(), name="register"),
]
