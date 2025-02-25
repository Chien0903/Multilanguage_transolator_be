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
        data = super().validate(attrs)
        
        user = self.user
        
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
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')
        if not user.check_password(current_password):
            return Response(
                {"detail": "Mật khẩu hiện tại không đúng."},
                status=400,
            )

        if new_password != confirm_password:
            return Response(
                {"detail": "Mật khẩu mới và Mật khẩu xác nhận không khớp."},
                status=404,
            )

        user.set_password(new_password)
        user.save()

        return Response(
            {"detail": "Đổi mật khẩu thành công."},
            status=200,
        )
        
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get (self, request):
        user = request.user
        data = {
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
        }

        return Response(data, status=200)
    
class UpdateProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        user = request.user
        full_name = request.data.get('full_name')
        email = request.data.get('email')
        role = request.data.get('role')
        if email:
            user.email = email
        if full_name:
            user.full_name = full_name
        if role:
            user.role = role
        user.save()
        return Response(
            {"detail": "Cập nhật thông tin thành công."},
            status=200,
        )

class GetUserDetailView(APIView):
    permission_classes = [IsAuthenticated]  # Yêu cầu user phải đăng nhập

    def get(self, request, user_id):
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({"detail": "Người dùng không tồn tại."}, status=404)

        data = {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
        }

        return Response(data, status=200)

class UpdateUserRoleView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_id):
        # Kiểm tra xem người gọi API có phải là Admin không
        if not request.user.role == "Admin":
            return Response({"detail": "Bạn không có quyền thay đổi vai trò."}, status=403)

        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({"detail": "Người dùng không tồn tại."}, status=404)

        new_role = request.data.get("role")
        if new_role not in ["Admin", "User"]:
            return Response({"detail": "Vai trò không hợp lệ."}, status=400)

        user.role = new_role
        user.save()

        return Response({"detail": "Cập nhật vai trò thành công."}, status=200)