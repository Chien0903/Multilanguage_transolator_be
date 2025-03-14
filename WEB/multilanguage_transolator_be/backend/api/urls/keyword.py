from django.urls import path
from api.views.keyword import CommonKeywordListView, CommonKeywordDetailView

urlpatterns = [
    path("api/common-keyword/", CommonKeywordListView.as_view(), name="common-keyword-list"),
    path("api/common-keyword/<int:pk>/", CommonKeywordDetailView.as_view(), name="common-keyword-detail"),
]
