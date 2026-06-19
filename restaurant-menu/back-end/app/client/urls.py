from django.urls import path
from .views import MenuItemViews

urlpatterns = [
    path('client/<int:restaurant>/', MenuItemViews.as_view(), name='client'),
    path('client/<int:restaurant>/<str:category>/', MenuItemViews.as_view(), name='category'),
    path('client/<int:restaurant>/<int:id>/', MenuItemViews.as_view(), name='detail')
]
