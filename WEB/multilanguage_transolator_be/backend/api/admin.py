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


from django.contrib import admin
from .models import CommonKeyword

@admin.register(CommonKeyword)
class CommonKeywordAdmin(admin.ModelAdmin):
    list_display = ("id", "japanese", "english", "vietnamese", "chinese_traditional", "chinese_simplified", "date_modified")
    search_fields = ("japanese", "english", "vietnamese", "chinese_traditional", "chinese_simplified")
    list_filter = ("date_modified",)
    ordering = ("-date_modified",)
