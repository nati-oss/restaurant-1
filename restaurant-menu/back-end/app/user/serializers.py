"""
Serializer of the user api.
"""
from rest_framework import serializers
from django.contrib.auth import get_user_model

class UserSerializer(serializers.ModelSerializer):
    """Seralizer of the user object ."""
    class Meta:
        model = get_user_model()
        fields = ['email', 'name', 'password']
        extra_fields = {'password':{'write_only':True, 'min_length':5}}

    def create(self, validated_data):
        return get_user_model().objects.create_user(**validated_data)



