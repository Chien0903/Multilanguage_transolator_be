from django.contrib import admin
from django.urls import path, include
from api.views.user import UserListView, UserProfileView, UpdateProfileView, UpdateUserRoleView, GetUserDetailView, DeleteUserView

urlpatterns = [
    path("api/user/", UserListView.as_view(), name="user_list"),
    path("api/user/profile/", UserProfileView.as_view(), name="user_profile"),
    path("api/user/update-profile/", UpdateProfileView.as_view(), name="update_profile"),
    path("api/user/<int:user_id>/", GetUserDetailView.as_view(), name="get-user-detail"),
    path("api/user/<int:user_id>/update-role/", UpdateUserRoleView.as_view(), name="update-user-role"),
    path("api/user/<int:user_id>/delete/", DeleteUserView.as_view(), name="delete-user"),
]
