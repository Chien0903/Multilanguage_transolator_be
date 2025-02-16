from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, required=True)
    full_name = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ["id", "username", "full_name" ,"password", "confirm_password"]
        extra_kwargs = {
            "password": {"write_only": True, "required": True},
        }

    def validate(self, data):
        print(data)
        """ Kiểm tra xem password và confirm_password có giống nhau không """
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError({"confirm_password": "Passwords do not match"})
        return data

    def create(self, validated_data):
        """ Xóa confirm_password trước khi lưu vào database """
        validated_data.pop("confirm_password")  # Không cần lưu confirm_password vào database
        user = User.objects.create_user(**validated_data)  # Sử dụng create_user để mã hóa mật khẩu
        return user