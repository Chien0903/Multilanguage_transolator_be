from django.urls import path
from backend.api.views.upload_file import UploadFileView, FileListView, DeleteFileView,FileHighlightView,FileExportView

urlpatterns = [
    path("upload-file/", UploadFileView.as_view(), name="upload-file"),
    path("files-list/", FileListView.as_view(), name="file-list"),
    path("delete-file/<int:file_id>/", DeleteFileView.as_view(), name="delete-file"),
    path("highlight-text/<int:pk>/", FileHighlightView.as_view(), name="highlight-text"),
    path("export-file/<int:pk>/", FileExportView.as_view(), name="export-file"),
]
