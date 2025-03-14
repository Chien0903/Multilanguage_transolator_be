from django.contrib import admin
from django.urls import path, include
from backend.api.views.auth import RegisterView, CustomTokenObtainPairView, ChangePasswordView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("api/user/register/", RegisterView.as_view(), name="register"),
    # path("api/token/", CustomTokenObtainPairView.as_view(), name="get_token"),
    # path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
     path("api/change-password/", ChangePasswordView.as_view(), name="change_password"),
]
