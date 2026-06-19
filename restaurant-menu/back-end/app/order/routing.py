from django.urls import path
from .consumers import KitchenConsumer


websocket_urlpatterns = [
    path("ws/kitchen/<int:restaurant_int/", KitchenConsumer.as_asgi()),
]