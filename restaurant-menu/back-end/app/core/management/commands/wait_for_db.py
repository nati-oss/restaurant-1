import time
from django.db import connections
from django.db.utils import OperationalError
from django.core.management import BaseCommand


class Command(BaseCommand):
    help = "wait for database to be available"

    def handle(self, *args, **options):
     self.stdout.write("Wating for database...")

     while True:
         try:
             connections['default'].cursor()
             break
         except OperationalError:
             self.stdout.write("Database not ready, wating 2 sec")
             time.sleep(2)

     self.stdout.write(self.style.SUCCESS('Database availaible!'))