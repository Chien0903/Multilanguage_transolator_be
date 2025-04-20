from django.urls import path
from backend.api.views.keyword import CommonKeywordListView, CommonKeywordDetailView, ReviewSuggestionView, KeywordSuggestionView, ApproveSuggestionView


urlpatterns = [
    path("", CommonKeywordListView.as_view(), name="common-keyword-list"),
    path("<int:pk>/", CommonKeywordDetailView.as_view(), name="common-keyword-detail"),
    path('suggestions/', KeywordSuggestionView.as_view(), name='suggestions'),
    path('suggestions/<int:pk>/review/', ReviewSuggestionView.as_view(), name='review-suggestion'),
    path('suggestions/<int:pk>/approve/', ApproveSuggestionView.as_view(), name='approve-suggestion'),
]
