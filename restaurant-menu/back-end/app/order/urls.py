"""create the url here"""
from django.urls import path
from .views import OrderView

urlpatterns = [
    path('restaurants/<int:resrtaurat_id>/tables/<int:table_id>/', OrderView.as_view(), name='order')
]
