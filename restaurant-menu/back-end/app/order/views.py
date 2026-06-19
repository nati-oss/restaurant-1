from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .serializers import OrderSerializer
from core.models import Restaurant, Table

class OrderView(APIView):
    def post(self, request, restauran_id, table_id):
        restaurant = get_object_or_404(
            Restaurant,
            id=restauran_id
        )

        table = get_object_or_404(
            Table,
            id=table_id,
            restaurant=restaurant
        )
        serializer = OrderSerializer(data=request.data)
        if serializer.is_valid():
            order = serializer.save(restaurant=restaurant, table=table)

            items_data = []
            for item in order.items.all():
                items_data.append({
                    'menu_item': item.menu_item.name,
                    'quantity': item.quantity,
                    "unit_price":str(item.price),
                    "subtotal": str(item.price * item.quantity)
                })

            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                "kitchen",
                {
                    "type": "new_order",
                     "data": {
                        "order_id": order.id,
                        'restaurant_id':restaurant.id,
                        "status": order.status,
                        "table": table.id,
                        "total": str(order.total_amount),
                        "items":items_data,
                        "created_at": order.created_at.isoformat()

                    }
                }
            )
            return Response(
                OrderSerializer(order).data,
                status=status.HTTP_201_CREATED
                )
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


