""" Views fo the MenuItem"""

from rest_framework.views import APIView
from rest_framework.response import Response
from core.models import MenuCategory,MenuItem


class MenuItemViews(APIView):
    def get(self, request, restaurant, category=None, pk=None):
        if category:
          item = MenuItem.objects.filter(restaurant=restaurant, category=category).order_by('-id')
          return Response({
              "name":item.name,
              "price":item.price,
              "image":item.image
          })
        elif pk:
            item = MenuItem.objects.get(restaurant=restaurant, id=pk)
            return Response({
                "name":item.name,
                "price":item.price,
                "image":item.price,
                "description":item.description,
                'is_available':item.is_available
            })

        item = MenuItem.objects.filter(restaurant=restaurant).order_by('-id')
        return Response({
            "name":item.name,
            "price":item.price,
            "image":item.image
        })