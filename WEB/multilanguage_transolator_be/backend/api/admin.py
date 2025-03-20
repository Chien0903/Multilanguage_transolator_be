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


from .models import CommonKeyword

@admin.register(CommonKeyword)
class CommonKeywordAdmin(admin.ModelAdmin):
    list_display = ("id", "japanese", "english", "vietnamese", "chinese_traditional", "chinese_simplified", "date_modified")
    search_fields = ("japanese", "english", "vietnamese", "chinese_traditional", "chinese_simplified")
    list_filter = ("date_modified",)
    ordering = ("-date_modified",)


from .models import FileUpload

@admin.register(FileUpload)
class fileUploadAdmin(admin.ModelAdmin):
    list_display = ('file_name', 'file_type', 'created_at', 'updated_at', 'user')  # Cột hiển thị trong danh sách
    list_filter = ('file_type', 'created_at', 'user')  # Bộ lọc bên phải
    search_fields = ('file_name', 'file_type')  # Trường tìm kiếm
    date_hierarchy = 'created_at'  # Lọc theo thời gian
    readonly_fields = ('file_name', 'file', 'created_at', 'updated_at', 'highlight_text')  # Trường chỉ đọc
    fields = ('file_name', 'file', 'file_type', 'created_at', 'updated_at', 'highlight_text', 'user')  # Các trường hiển thị trong form chỉnh sửa

    def has_add_permission(self, request):
        # Tắt nút "Add" vì file thường được upload qua frontend
        return False

    def has_delete_permission(self, request, obj=None):
        # Cho phép xóa file từ admin
        return True

    def has_change_permission(self, request, obj=None):
        # Cho phép chỉnh sửa highlights (nếu cần)
        return True

    # Tùy chỉnh hiển thị highlights trong admin
    def highlights_display(self, obj):
        return ", ".join([f"Page {h.get('page', '')}: {h.get('content', '')[:50]}" for h in obj.highlights[:5]]) if obj.highlights else "No highlights"
    highlights_display.short_description = "Highlights (Preview)"

    # Thêm cột highlights vào list_display
    list_display = list_display + ('highlights_display',)