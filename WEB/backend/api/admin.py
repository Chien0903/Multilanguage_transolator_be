from django.contrib import admin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ["id", "username", "full_name", "is_active", "is_staff", "is_superuser"]
    search_fields = ["username", "full_name"]
    list_filter = ["is_active", "is_staff", "is_superuser"]
    ordering = ["-id"]
    fieldsets = (
        (None, {"fields": ("username", "full_name", "password")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("username", "full_name", "password1", "password2", "is_active", "is_staff", "is_superuser"),
        }),
    )
    filter_horizontal = ()
    readonly_fields = ["id"]
# Register your models here.
