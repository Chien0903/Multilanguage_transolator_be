from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from backend.api.models.upload_file import FileUpload
from backend.api.serializers.upload_file import FileUploadSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from PyPDF2 import PdfReader, PdfWriter
import io


class UploadFileView(APIView):
    def post(self, request):
        file = request.FILES.get("file")
        if not file:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        # Xác định loại file
        ext = file.name.split(".")[-1].lower()
        file_types = {
            "pdf": "pdf",
            "docx": "docx",
            "xlsx": "xlsx",
            "doc": "doc",
            "xls": "xls",
        }
        file_type = file_types.get(ext, "other")

        # Lưu file vào database
        uploaded_file = FileUpload.objects.create(
            file=file, file_name=file.name, file_type=file_type
        )

        if request.user.is_authenticated:
            uploaded_file.user = request.user
        uploaded_file.save()

        serializer = FileUploadSerializer(uploaded_file)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class FileListView(APIView):
    def get(self, request):
        files = FileUpload.objects.all().order_by("-created_at")
        return Response(FileUploadSerializer(files, many=True).data)

class DeleteFileView(APIView):
    def delete(self, request, file_id):
        try:
            file = FileUpload.objects.get(id=file_id)
            file.delete()
            return Response({"message": "File deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except FileUpload.DoesNotExist:
            return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)
        
        
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from backend.api.services.upload_to_s3 import upload_to_s3
import os

@csrf_exempt
def upload_file_to_s3(request):
    if request.method == 'POST':
        try:
            # Lấy file từ request
            if 'file' not in request.FILES:
                return JsonResponse({'error': 'No file provided'}, status=400)

            file = request.FILES['file']
            bucket_name = os.getenv('AWS_STORAGE_BUCKET_NAME')

            # Tạo object name (key) trên S3
            object_name = f"uploads/{file.name}"

            # Upload file lên S3
            public_url = upload_to_s3(file, bucket_name, object_name)
            if public_url:
                return JsonResponse({'publicUrl': public_url})
            else:
                return JsonResponse({'error': 'Failed to upload file to S3'}, status=500)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)