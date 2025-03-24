from django.urls import path
from backend.api.views.upload_file import UploadFileView, FileListView, DeleteFileView, upload_file_to_s3
urlpatterns = [
    path("upload-file/", UploadFileView.as_view(), name="upload-file"),
    path('upload-to-s3/', upload_file_to_s3, name='upload_file_to_s3'),  
    path("files-list/", FileListView.as_view(), name="file-list"),
    path("delete-file/<int:file_id>/", DeleteFileView.as_view(), name="delete-file"),
]
