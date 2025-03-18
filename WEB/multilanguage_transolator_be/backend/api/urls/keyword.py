from django.urls import path
from backend.api.views.keyword import CommonKeywordListView, CommonKeywordDetailView

urlpatterns = [
    path("", CommonKeywordListView.as_view(), name="common-keyword-list"),
    path("<int:pk>/", CommonKeywordDetailView.as_view(), name="common-keyword-detail"),
]
