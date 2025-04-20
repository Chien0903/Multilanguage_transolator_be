from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from ..models.commonLib import CommonKeyword, KeywordSuggestion
from ..serializers.keyword import CommonKeywordSerializer, KeywordSuggestionSerializer

class CommonKeywordListView(APIView):
    permission_classes = [IsAuthenticated]  # Chỉ người dùng đã đăng nhập mới truy cập

    def get(self, request):
        keywords = CommonKeyword.objects.all().order_by("-date_modified")
        serializer = CommonKeywordSerializer(keywords, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CommonKeywordSerializer(data=request.data)
        if serializer.is_valid():
            keyword = serializer.save()
            return Response(serializer.data, status=201)  
        return Response(serializer.errors, status=400)
class CommonKeywordDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return CommonKeyword.objects.get(id=pk)
        except CommonKeyword.DoesNotExist:
            return None

    def get(self, request, pk):
        keyword = self.get_object(pk)
        if keyword is None:
            return Response({"detail": "Keyword not found"}, status=status.HTTP404_NOT_FOUND)
        serializer = CommonKeywordSerializer(keyword)
        return Response(serializer.data)

    def put(self, request, pk):
        keyword = self.get_object(pk)
        if keyword is None:
            return Response({"detail": "Keyword not found"}, status=status.HTTP404_NOT_FOUND)
        serializer = CommonKeywordSerializer(keyword, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP400_BAD_REQUEST)

    def delete(self, request, pk):
        keyword = self.get_object(pk)
        if keyword is None:
            return Response({"detail": "Keyword not found"}, status=404)
        keyword.delete()
        return Response(status=204)

class KeywordSuggestionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        suggestions = KeywordSuggestion.objects.all().order_by('-created_at')
        serializer = KeywordSuggestionSerializer(suggestions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = KeywordSuggestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
   
class ReviewSuggestionView(APIView):
    permission_classes = [IsAuthenticated]

    def put (self, request, pk):
        try: 
            suggestion = KeywordSuggestion.objects.get(id=pk)
        except KeywordSuggestion.DoesNotExist:
            return Response({"detail": "Suggestion not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if suggestion.status != 'pending':
            return Response({"detail": "Suggestion has already been reviewed"}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = KeywordSuggestionSerializer(suggestion, data=request.data, partial=True)
        if serializer.is_valid():
            suggestion = serializer.save(reviewed_by=request.user, status='reviewed')
            return Response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
class ApproveSuggestionView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        try:
            suggestion = KeywordSuggestion.objects.get(id=pk)
        except KeywordSuggestion.DoesNotExist:
            return Response({"detail": "Not found"}, status=404)

        if suggestion.status != 'reviewed':
            return Response({"detail": "Suggestion must be reviewed before approval"}, status=400)

        # Tạo bản ghi trong CommonKeyword
        common_data = {
            "japanese": suggestion.japanese,
            "english": suggestion.english,
            "vietnamese": suggestion.vietnamese,
            "chinese_traditional": suggestion.chinese_traditional,
            "chinese_simplified": suggestion.chinese_simplified,
        }
        keyword_serializer = CommonKeywordSerializer(data=common_data)
        if keyword_serializer.is_valid():
            keyword_serializer.save()
            suggestion.status = 'approved'
            suggestion.approved_by = request.user
            suggestion.save()
            return Response({"message": "Suggestion approved and added to library!"})
        return Response(keyword_serializer.errors, status=400)