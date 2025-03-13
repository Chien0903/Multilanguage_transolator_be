from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, first_name, last_name, password=None, role='User', **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name, last_name=last_name, role=role, **extra_fields)
        user.set_password(password)  # Sử dụng set_password để mã hóa mật khẩu
        user.save(using=self._db)
        return user

    def create_superuser(self, email, first_name, last_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, first_name, last_name, password, role='Admin', **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('User', 'User'),
        ('Admin', 'Admin'),
    ]
    
    email = models.EmailField(unique=True, max_length=255)
    first_name = models.CharField(max_length=30, blank=True, null=True)
    last_name = models.CharField(max_length=30, blank=True, null=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='User')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    objects = CustomUserManager()

    USERNAME_FIELD = 'email'           
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def __str__(self):
        return f"{self.email} - {self.first_name} {self.last_name} - {self.role}"
    

# accounts/models.py
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