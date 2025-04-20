from django.db import models
from .user import CustomUser 


class CommonKeyword(models.Model):
    japanese = models.CharField(max_length=255)
    english = models.CharField(max_length=255)
    vietnamese = models.CharField(max_length=255)
    chinese_traditional = models.CharField(max_length=255)
    chinese_simplified = models.CharField(max_length=255)
    date_modified = models.DateField(auto_now=True)

    def __str__(self):
        return f"{self.japanese} - {self.english}"
    
class KeywordSuggestion(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, null=True, blank=True)
    japanese = models.TextField(blank=True, null=True)
    english = models.TextField(blank=True, null=True)
    vietnamese = models.TextField(blank=True, null=True)
    chinese_traditional = models.TextField(blank=True, null=True)
    chinese_simplified = models.TextField(blank=True, null=True)

    status = models.CharField(
        max_length=20,
        choices=[
            ('pending', 'Pending'),
            ('reviewed', 'Reviewed'),
            ('approved', 'Approved'),
        ],
        default='pending'
    )
    reviewed_by = models.ForeignKey(CustomUser, null=True, blank=True, related_name='reviewed_suggestions', on_delete=models.SET_NULL)
    approved_by = models.ForeignKey(CustomUser, null=True, blank=True, related_name='approved_suggestions', on_delete=models.SET_NULL)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Suggestion by {self.user} | {self.status}"