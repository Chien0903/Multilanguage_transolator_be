from django.db import models
from .user import CustomUser

class FileUpload(models.Model):
    FILE_TYPE = (
        ('pdf', 'PDF'),
        ('docx', 'DOCX'),
        ('doc', 'DOC'),
        ('xls', 'XLS'),
        ('xlsx', 'XLSX'),
    )
    file_name = models.CharField(max_length=255)
    file = models.FileField(upload_to='upload/')
    file_type = models.CharField(max_length=10, choices=FILE_TYPE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    highlight_text = models.JSONField(default=list, blank=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='file_uploads', null=True, blank=True)
    
    def __str__(self):
        return self.file_name
    
    class Meta:
        ordering = ['-created_at']
        
class File(models.Model):
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50)
    file_url = models.URLField(max_length=255)

class HighlightText(models.Model):
    file = models.ForeignKey(File, on_delete=models.CASCADE, related_name="highlight_text")
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True)
    page_number = models.IntegerField()
    text = models.TextField()  # Nội dung đoạn text được highlight
    color = models.CharField(max_length=7)  # Mã màu (hex)
    coordinates = models.JSONField()  # Tọa độ trong PDF (x1, y1, x2, y2)
    
    