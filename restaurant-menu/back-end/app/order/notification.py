from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def notify_kitchen(order, items_data):

     channel_layer = get_channel_layer()

     async_to_sync(channel_layer.group_send)(
         f"restaurant_{order.restaurant.id}_kitchen",
         {
             "type":"new_order",
             "data": {
                 "order_id":order.id,
                 "table": order.table.id,
                 "status": order.status,
                 'items':items_data,
             }
         }
     )