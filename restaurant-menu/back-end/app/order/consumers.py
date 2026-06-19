from channels.generic.websocket import AsyncJsonWebsocketConsumer
import json


class KitchenConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
      restaurant_id = self.scope['url_route']['kwargs']['restaurant_id']
      self.group_name = f"restaurant_{restaurant_id}_kitchen"

      await self.channel_layer.group_add(
          self.group_name,
          self.channel_name
      )

      await self.accept()

    async def disconnect(self, close_code):

       await self.channel_layer.group_discard(
           self.group_name,
           self.channel_name
       )

    async def new_order(self, event):
        await self.send(text_data=json.dumps({
            "event": "new_order",
            "data": event['data']
        }))