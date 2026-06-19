"""
models of the database
"""
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser, PermissionsMixin, BaseUserManager
)


class UserManager(BaseUserManager):
    """model manager"""
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError
        user = self.model(email=self.normalize_email(email), **extra_fields )
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password, name, **extra_fields):
        """create super user for admin and root access"""
        user = self.create_user(email=email, password=password, name=name, **extra_fields)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user

class User(AbstractBaseUser, PermissionsMixin):
    """Model of the user database"""
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    is_staff  = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    objects = UserManager ()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ['name']


class Restaurant(models.Model):
    """create the model  for lists of restaurants. """
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    logo = models.ImageField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.name


class Table(models.Model):
    """Create the model of the table number inside the restaurant.  """

    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    number = models.IntegerField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.number


class MenuCategory(models.Model):
    """Create the model of the item cactegory. """

    restaurant = models.ForeignKey(Restaurant, models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


class MenuItem(models.Model):
    """Cretae the model of the menu item"""
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    category = models.ForeignKey(MenuCategory, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_available = models.BooleanField(default=True)
    image = models.ImageField(blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Order(models.Model):
    """Create the model of order by the customer"""

    STATUS_PENDING = 'pending'
    STATUS_PREPARING = 'preparing'
    STATUS_READY = 'ready'
    STATUS_CANCEL = 'canceled'
    STATUS_COMPLETED = 'completed'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_PREPARING, 'Preparing'),
        (STATUS_READY, 'Ready'),
        (STATUS_CANCEL, 'Cancel')
    ]
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    table = models.ForeignKey(Table, on_delete=models.CASCADE)
    status = models.CharField(
        max_length=25,
        choices=STATUS_CHOICES,
        default=STATUS_PENDING
        )
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class OrderItem(models.Model):
    """create the model of the order item. """

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.PositiveBigIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
