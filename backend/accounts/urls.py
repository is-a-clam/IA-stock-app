from django.urls import path
from . import views

app_name = "accounts"

urlpatterns = [
    path("login/", views.loginView, name="login"),
    path("login-set-cookie/", views.loginSetCookie, name="setCSRF"),
    path("logout/", views.logoutView, name="logout"),
    path("register/", views.registerView.as_view(), name="register"),
    path("change-password/", views.changePasswordView.as_view(), name="changePassword"),
    path("delete-user/", views.deleteUserView.as_view(), name="deleteUser")
]
