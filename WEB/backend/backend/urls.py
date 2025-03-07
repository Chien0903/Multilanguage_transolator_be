
from django.contrib import admin
from django.urls import path, include
from api.views import RegisterView, CustomTokenObtainPairView, UserListView, ChangePasswordView, UserProfileView, UpdateProfileView, UpdateUserRoleView, GetUserDetailView, DeleteUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/", RegisterView.as_view(), name="register"),
    path("api/token/", CustomTokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh_token"),
    path("api/user/", UserListView.as_view(), name="user_list"),
    path("api/change-password/", ChangePasswordView.as_view(), name="change_password"),
    path("api/user/profile/", UserProfileView.as_view(), name="user_profile"),
    path("api/user/update-profile/", UpdateProfileView.as_view(), name="update_profile"),
    path("api/user/<int:user_id>/", GetUserDetailView.as_view(), name="get-user-detail"),
    path("api/user/<int:user_id>/update-role/", UpdateUserRoleView.as_view(), name="update-user-role"),
    path("api/user/<int:user_id>/delete/", DeleteUserView.as_view(), name="delete-user"),
    path("api-auth/", include("rest_framework.urls")),
]
