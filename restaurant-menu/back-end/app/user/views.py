"""
 Create the user view
    """
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from user import serializers
from rest_framework.views import APIView
from django.contrib.auth import get_user_model

class CreateUserView(generics.CreateAPIView):
  serializer_class = serializers.UserSerializer

class ManageUserView(generics.RetrieveUpdateAPIView):
   serializer_class = serializers.UserSerializer
   authentication_classes = [JWTAuthentication]
   permission_classes = [IsAuthenticated]

   def get_object(self):
      return self.request.user