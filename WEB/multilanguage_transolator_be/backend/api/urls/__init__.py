from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from backend.api.views.translate import TranslateFileView

urlpatterns = [
    path('', include('backend.api.urls.auth')),
    path('common-keyword/', include('backend.api.urls.keyword')),
    path('user/', include('backend.api.urls.user')),
    path('file/', include('backend.api.urls.upload_file')),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('translate/', TranslateFileView.as_view(), name='translate_file'),
]