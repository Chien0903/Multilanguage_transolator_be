from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from ..models.commonLib import CommonKeyword
from ..serializers.keyword import CommonKeywordSerializer

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
            return Response({"detail": "Keyword not found"}, status=status.HTTP404_NOT_FOUND)
        keyword.delete()
        return Response(status=status.HTTP204_NO_CONTENT)