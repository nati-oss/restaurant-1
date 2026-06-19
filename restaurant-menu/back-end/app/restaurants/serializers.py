"""
Serializers for the restaurants
    """
from rest_framework import serializers
from core.models import Restaurant, MenuCategory, MenuItem, Table

class RestaurantSerializer(serializers.ModelSerializer):
    """Serializer for the restaurants object"""

    class Meta:
        model = Restaurant
        fields = ['name', 'logo']


class MenuCategorySerializer(serializers.ModelSerializer):
    """Serializer for the menu category object"""
    class Meta:
        model = MenuCategory
        fields = ['id','name']
        read_only_fields = ['id']

class MenuItemSerializer(serializers.ModelSerializer):
    """Serializer for menu item object"""
    class Meta:
        model = MenuItem
        fields = ['id','name','price','is_available','image']
        read_only_fields = ['id', 'is_available']

class TableSerializer(serializers.ModelSerializer):
    """Serializer for table object"""
    class Meta:
        model = Table
        fields = ['id, number', 'restaurant']
        read_only_fields = ['id', 'restaurant']
