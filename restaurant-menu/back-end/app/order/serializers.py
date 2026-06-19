"""Create the order serializer"""
from rest_framework import serializers
from core.models import Order, OrderItem, MenuItem


class OrderItemSerializer(serializers.ModelSerializer):
    """create the serializer object of order. """
    class Meta:
        model = OrderItem
        fields = ['menu_item', 'quantity']

class OrderSerializer(serializers.ModelSerializer):

    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'restaurant',
            'table',
            'status',
            'total_amount',
            'created_at',
            'updated_at',
            'items'
            ]
        read_only_fields = [
            'id',
            'total_amount',
            'created_at',
            'updated_at'
        ]
    def create(self, validated_data):
        items = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        total  = 0

        for item_data in items:
            menu_item = item_data['menu_item']
            quantity = item_data['quantity']

            order_item = OrderItem.objects.create(
                order = order,
                menu_item = menu_item,
                quantity  = quantity,
                price = menu_item.price
            )
            total += menu_item.price * quantity

        order.total_amount = total
        order.save()
        return order