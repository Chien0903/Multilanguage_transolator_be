from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ["id", "email", "first_name", "last_name", "role", "is_active", "is_staff", "is_superuser"]
    search_fields = ["email", "first_name", "last_name"]
    list_filter = ["is_active", "is_staff", "is_superuser", "role"]
    ordering = ["-id"]
    
    fieldsets = (
        (None, {"fields": ("email", "first_name", "last_name", "password", "role")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser")}),
    )
    
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "first_name", "last_name", "role", "password1", "password2", "is_active", "is_staff", "is_superuser"),
        }),
    )
    
    readonly_fields = ["id"]

admin.site.register(CustomUser, CustomUserAdmin)
