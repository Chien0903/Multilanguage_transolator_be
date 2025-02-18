from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import generics
from .serializers import RegisterSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, AllowAny

User = get_user_model()
# Create your views here.
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        # Gọi validate gốc để sinh access & refresh token
        data = super().validate(attrs)
        
        user = self.user  # User hiện tại
        
        # Thêm thông tin của user vào response
        data["id"] = user.id
        data["email"] = user.email
        data["full_name"] = user.full_name
        data["role"] = user.role
        data["is_active"] = user.is_active
        data["is_staff"] = user.is_staff
        data["is_superuser"] = user.is_superuser

        return data
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer