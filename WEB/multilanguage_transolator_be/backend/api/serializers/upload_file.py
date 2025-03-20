from rest_framework import serializers
from ..models import FileUpload

class FileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileUpload
        fields = ["id", "file_name", "file_type", "created_at", "updated_at", "highlight_text", "user"]
