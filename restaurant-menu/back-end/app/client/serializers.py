"""
Serializer for the client
"""

from rest_framework import serializers
from core.models import MenuCategory,MenuItem

class MenuCategorySerializer(serializers.ModelSerializer):
    """serializer of the Menu category object"""
    model = MenuCategory
    fields = ['name','description']

class MenuItemSerializer(serializers.ModelSerializer):
    """Serializer for the menu item object"""
    model = MenuItem
    fields = ['name','price','image','category','is_available']