"""
Create View for restaurants
"""
from rest_framework.views import APIView
from core.models import Restaurant, MenuCategory, MenuItem
from .serializers import (
    RestaurantSerializer,
    MenuCategorySerializer,
    MenuItemSerializer,
    TableSerializer
    )
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

class RestaurantView(APIView):
    """Create restaurant view object"""

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def  post(self, request):
       owner = request.user
       serializer = RestaurantSerializer(data=request.data)

       if serializer.is_valid():
           serializer.save(owner=owner)
           return Response(serializer.data, status=status.HTTP_201_CREATED)

       return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        try:
            restaurant = Restaurant.objects.get(owner=request.user)
            serializer = RestaurantSerializer(restaurant)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Restaurant.DoesNotExist:

         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def  put(self, request):
       owner = request.user
       serializer = RestaurantSerializer(data=request.data)

       if serializer.is_valid():
           serializer.save(owner=owner)
           return Response(serializer.data)

       return Response(serializer.errors)

    def  delete(self, request):
        try:
            restaurant = Restaurant.objects.filter(owner=request.user)
            restaurant.delete()
            return Response({"mesage":"deleted"}, status=status.HTTP_200_OK)
        except Restaurant.DoesNotExist:
            return Response({"error":"object not found"})

class TableView(APIView):
    """create a table for restaurants"""
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def  post(self, request):
        restaurant = Restaurant.objects.get(owner=request.user)
        table = TableSerializer(data=request.data)

class MenuCategoryView(APIView):
    """Create a menu category for restaurants"""

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def  post(self, request):

     restaurant = Restaurant.objects.get(owner=request.user)
     serializer = MenuCategorySerializer(data=request.data)

     if serializer.is_valid():
         serializer.save(restaurant=restaurant)
         return Response(serializer.data, status=status.HTTP_200_OK)

     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request):

     try:
      restaurant = Restaurant.objects.get(owner=request.user)
      menu_category = MenuCategory.objects.filter(restaurant=restaurant).order_by('-id')
      serializer = MenuCategorySerializer(menu_category, many=True)

      return Response(serializer.data)

     except:

      return Response({'message':'error'}, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):

     restaurant = Restaurant.objects.get(owner=request.user)
     menu_category = MenuCategory.objects.get(id=pk)

     serializer = MenuCategorySerializer(menu_category, data=request.data)

     if serializer.is_valid():
         serializer.save(restaurant=restaurant)
         return Response(serializer.data, status=status.HTTP_200_OK)

     return Response(serializer.errors)

    def delete(self, request, pk):
        try:
            menu_category = MenuCategory.objects.get(id=pk)
            menu_category.delete()

            return Response(status=status.HTTP_200_OK)
        except Exception:

         return Response({"errors":str(Exception)})

class MenuItemView(APIView):
    """Create a menu item view object"""

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):

       try:

        restaurant = Restaurant.objects.get(owner=request.user)
        category_name = request.data.get("category")
        category = MenuCategory.objects.get(name=category_name)
       except Restaurant.DoesNotExist:
           return Response({'message':"owner not found"})

       serializer = MenuItemSerializer(data=request.data)
       if serializer.is_valid():
           serializer.save(restaurant=restaurant, category=category)
           return Response(serializer.data, status=status.HTTP_200_OK)

       return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk=None):
      if pk:
            item = MenuItem.objects.get(id=pk)
            return Response(
            {
             "name":item.name,
             "price":item.price,
             "is_available":item.is_available,
             'description':item.description,
             "category":item.category.name,
             'created_at':item.created_at,
             'restaurant':item.restaurant.name
             }
        )
      try:

        restaurant = Restaurant.objects.get(owner=request.user)
        menu_item = MenuItem.objects.filter(restaurant=restaurant).order_by('-id')
        serializer= MenuItemSerializer(menu_item, many=True)

        return Response(serializer.data)

      except Exception:
          return Response({"error":str(Exception)})


    def put(self, request, pk):
        restaurant = Restaurant.objects.get(owner=request.user)
        menu_item = MenuItem.objects.get(id=pk)

        serializer = MenuItemSerializer(menu_item, data=request.data)
        if serializer.is_valid():
            serializer.save(restaurant=restaurant)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        restaurant = Restaurant.objects.get(owner=request.user)
        menu_item = MenuItem.objects.get(id=pk)

        serializer = MenuItemSerializer(menu_item, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(restaurant=restaurant)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            menu_item = MenuItem.objects.get(id=pk)
            menu_item.delete()
            return Response({'message':'deleted'})
        except Exception:
            return Response({'errors': str(Exception)})