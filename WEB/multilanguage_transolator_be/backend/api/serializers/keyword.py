from rest_framework import serializers
from django.core.exceptions import ValidationError
from backend.api.models.commonLib import CommonKeyword

class CommonKeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommonKeyword
        fields = "__all__"