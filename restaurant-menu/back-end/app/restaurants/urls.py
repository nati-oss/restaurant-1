"""
create the url for the restaurant
"""
from django.urls import path
from .views import RestaurantView,MenuCategoryView,MenuItemView

urlpatterns = [
    path('restaurant/', RestaurantView.as_view(), name='restaurant'),
    path('category/', MenuCategoryView.as_view(), name='category'),
    path('category/<int:pk>/', MenuCategoryView.as_view()),
    path('item/', MenuItemView.as_view(), name='menu-item'),
    path('item/<int:pk>/', MenuItemView.as_view())

]
