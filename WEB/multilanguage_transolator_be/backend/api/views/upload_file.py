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

class FileHighlightView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, pk):
        try:
            uploaded_file = FileUpload.objects.get(pk=pk)
            highlights = request.data.get("highlights", [])

            if uploaded_file.file_type == 'pdf':
                # Lưu metadata highlight
                uploaded_file.highlights = highlights
                uploaded_file.save()

                # (Tùy chọn) Áp dụng highlight trực tiếp lên file PDF
                existing_pdf = PdfReader(io.BytesIO(uploaded_file.file.read()))
                output_pdf = PdfWriter()

                for page_num in range(len(existing_pdf.pages)):
                    page = existing_pdf.pages[page_num]
                    for highlight in highlights:
                        if highlight.get("page") == page_num:
                            # Logic vẽ highlight (cần tọa độ từ frontend)
                            pass  # Hiện tại chỉ lưu metadata, cần mở rộng để vẽ
                    output_pdf.add_page(page)

                buffer = io.BytesIO()
                output_pdf.write(buffer)
                uploaded_file.file = buffer.getvalue()
                uploaded_file.save()

            return Response({"message": "Highlights saved successfully"}, status=status.HTTP_200_OK)
        except FileUpload.DoesNotExist:
            return Response({"message": "File not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FileExportView(APIView):
    def get(self, request, pk):
        try:
            uploaded_file = FileUpload.objects.get(pk=pk)
            serializer = FileUploadSerializer(uploaded_file)
            return Response(serializer.data)
        except FileUpload.DoesNotExist:
            return Response({"message": "File not found"}, status=status.HTTP_404_NOT_FOUND)    
