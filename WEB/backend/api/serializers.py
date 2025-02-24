from rest_framework import serializers
from django.core.exceptions import ValidationError
from api.models import CustomUser

def validate_email(value):
    # if CustomUser.objects.filter(email=value).exists():
    #     raise ValidationError("Email đã tồn tại. Vui lòng sử dụng email khác.")
    if not value.endswith('@gmail.com'):
        raise serializers.ValidationError("Email phải có định dạng @gmail.com.")
    return value

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(validators=[validate_email])
    
    class Meta:
        model = CustomUser
        fields = ["email", "full_name", "password", "role"]
        extra_kwargs = {
            "password": {"write_only": True}
        }
    
    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data["email"],
            full_name=validated_data["full_name"],
            password=validated_data["password"],
            role=validated_data.get("role", "User")
        )
        return user

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'full_name', 'role']