from django.shortcuts import render
from rest_framework import generics
from .serializers import RegisterSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import CustomUser
from .serializers import CustomUserSerializer
from rest_framework.response import Response
from rest_framework.views import APIView


# Create your views here.
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
class UserListView(generics.ListAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
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
    
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]  # Chỉ người dùng đã đăng nhập mới được đổi mật khẩu

    def put(self, request, *args, **kwargs):
        user = request.user
        current_password = request.data.get('currentPassword')
        new_password = request.data.get('newPassword')
        confirm_password = request.data.get('confirmPassword')

        # Kiểm tra mật khẩu mới và xác nhận phải khớp
        if new_password != confirm_password:
            return Response(
                {"detail": "Mật khẩu mới và xác nhận không khớp."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Kiểm tra mật khẩu hiện tại có đúng không
        if not user.check_password(current_password):
            return Response(
                {"detail": "Mật khẩu hiện tại không đúng."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Cập nhật mật khẩu mới
        user.set_password(new_password)
        user.save()

        return Response(
            {"detail": "Đổi mật khẩu thành công."},
            status=status.HTTP_200_OK,
        )