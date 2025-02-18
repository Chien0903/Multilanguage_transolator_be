from rest_framework import serializers
from api.models import CustomUser

def validate_email(value):
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
