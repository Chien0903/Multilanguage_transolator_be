import os
import docx
import openpyxl
import PyPDF2
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from google.cloud import translate
from dotenv import load_dotenv
import tempfile
import requests
from backend.api.services.upload_to_s3 import upload_to_s3
from django.conf import settings

load_dotenv()

# Check if the credentials file exists before setting it
if hasattr(settings, 'GOOGLE_CREDS_PATH') and settings.GOOGLE_CREDS_PATH and os.path.isfile(settings.GOOGLE_CREDS_PATH):
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = settings.GOOGLE_CREDS_PATH
else:
    # Log a warning or handle the missing credentials case
    print("WARNING: Google Cloud credentials file not found. Translation features may not work.")
    # You could also raise an exception if translation is critical to your app

LANGUAGES = {
    'vi': "Vietnamese",
    'ja': "Japanese",
    'zh-CN': "Chinese",
    'en': "English"
}

# Hàm để trích xuất nội dung từ các file PDF, DOCX, XLSX
def extract_content(file_path: str) -> str:
    file_extension = file_path.split(".")[-1].lower()
    if file_extension == "pdf":
        return extract_from_pdf(file_path)
    elif file_extension == "docx":
        return extract_from_docx(file_path)
    elif file_extension == "xlsx":
        return extract_from_xlsx(file_path)
    else:
        raise Exception("Unsupported file type")

# Trích xuất văn bản từ file PDF
def extract_from_pdf(file_path: str) -> str:
    content = ""
    with open(file_path, "rb") as f:
        pdf_reader = PyPDF2.PdfReader(f)
        for page in pdf_reader.pages:
            content += page.extract_text() or ""
            if len(content.split()) >= 100:
                break
    return content[:100]

# Trích xuất văn bản từ file DOCX
def extract_from_docx(file_path: str) -> str:
    content = ""
    doc = docx.Document(file_path)
    for para in doc.paragraphs:
        content += para.text + " "
        if len(content.split()) >= 100:
            break
    return content[:100]

# Trích xuất văn bản từ file XLSX
def extract_from_xlsx(file_path: str) -> str:
    content = ""
    workbook = openpyxl.load_workbook(file_path)
    sheet = workbook.active
    for row in sheet.iter_rows(values_only=True):
        for cell in row:
            if cell:
                content += str(cell) + " "
                if len(content.split()) >= 100:
                    break
        if len(content.split()) >= 100:
            break
    return content[:100]

# Phát hiện ngôn ngữ của văn bản
def detect_language(text: str):
    try:
        client = translate.TranslationServiceClient()
        parent = f"projects/{PROJECT_ID}/locations/global"
        request = translate.DetectLanguageRequest(content=text, parent=parent)
        response = client.detect_language(request=request)
        detected_language = response.languages[0].language_code
        return detected_language
    except Exception as e:
        raise Exception(f"Error detecting language: {str(e)}")

# Hàm để dịch tài liệu
def translate_document(file_path: str, target_language: str):
    client = translate.TranslationServiceClient()
    location = 'global'
    parent = f"projects/{PROJECT_ID}/locations/{location}"

    file_extension = file_path.split(".")[-1].lower()
    mime_types = {
        "pdf": "application/pdf",
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }

    if file_extension not in mime_types:
        raise Exception("Unsupported file type")

    mime_type = mime_types[file_extension]

    with open(file_path, "rb") as document:
        document_content = document.read()

    detected_language = detect_language(extract_content(file_path))

    if detected_language not in LANGUAGES:
        raise Exception("Unsupported detected language")

    # Dịch tài liệu
    request = {
        "parent": parent,
        "document_input_config": {
            "content": document_content,
            "mime_type": mime_type,
        },
        "source_language_code": detected_language,
        "target_language_code": target_language,
    }

    response = client.translate_document(request=request)
    translated_content = response.document_translation.byte_stream_outputs[0]

    base_name = file_path.rsplit(".", 1)[0]
    translated_file_path = f"{base_name}_{target_language}.{file_extension}"

    with open(translated_file_path, "wb") as out_file:
        out_file.write(translated_content)
    bucket_name = os.getenv('AWS_STORAGE_BUCKET_NAME')
    # Tải lên S3 sau khi dịch xong
    s3_url = upload_to_s3(translated_file_path, bucket_name, f"translated/{os.path.basename(translated_file_path)}")

    # Xóa file tạm thời sau khi tải lên S3
    os.remove(translated_file_path)

    return s3_url


# API View để upload và dịch file
class TranslateFileView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        file_url = request.data.get("file_url")
        target_language = request.data.get("target_languages")
        print(file_url, target_language)
        if not file_url or not target_language:
            return JsonResponse({"detail": "Missing file_url or target_language"}, status=400)

        try:
            # Tải file về từ URL
            file_extension = file_url.split(".")[-1].lower()
            temp_file_path = os.path.join(tempfile.gettempdir(), f"tempfile.{file_extension}")

            response = requests.get(file_url)
            with open(temp_file_path, "wb") as file:
                file.write(response.content)
            # Dịch tài liệu và tải lên S3
            translated_file_url = translate_document(temp_file_path, target_language)
            
            return JsonResponse({"translated_file_url": translated_file_url}, status=200)

        except Exception as e:
            return JsonResponse({"detail": f"Error: {str(e)}"}, status=500)
