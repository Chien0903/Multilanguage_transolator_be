from django.db import models

class CommonKeyword(models.Model):
    japanese = models.CharField(max_length=255)
    english = models.CharField(max_length=255)
    vietnamese = models.CharField(max_length=255)
    chinese_traditional = models.CharField(max_length=255)
    chinese_simplified = models.CharField(max_length=255)
    date_modified = models.DateField(auto_now=True)

    def __str__(self):
        return f"{self.japanese} - {self.english}"