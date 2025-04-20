from rest_framework import serializers
from django.core.exceptions import ValidationError
from backend.api.models.commonLib import CommonKeyword, KeywordSuggestion

class CommonKeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommonKeyword
        fields = "__all__"


class KeywordSuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = KeywordSuggestion
        fields = '__all__'
        read_only_fields = ['user', 'status', 'reviewed_by', 'approved_by', 'created_at', 'updated_at']
