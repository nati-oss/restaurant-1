"""Admin of the system"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from core import models

class UserAdmin(BaseUserAdmin):
    """Define the admin pages for users. """
    ordering = ['id']
    list_display = ['email', 'name']
    fieldsets = (
        (None, {'fields':('email', 'password')}),
        (
            _('permission'),
            {
                'fields': (
                    'is_active',
                    'is_staff',
                    'is_superuser'
                )
            }
        ),
        (_('Important dates'), {'fields': ('last_login',)}),
    )

    readonly_fields = ['last_login']
    add_fieldsets = (
        (None, {
            'classes':('wide',),
            'fields': (
                'email',
                'name',
                'password1',
                'password2',
                'is_active',
                'is_staff',
                'is_superuser',
            )
        }),
    )

class RestaurantAdmin(admin.ModelAdmin):
    ordering = ['-id']
    list_display = ['name', 'owner']

class MenuCategoryAdmin(admin.ModelAdmin):
    ordering =['-id']
    list_display = ['name', 'restaurant']

class MenuItemAdmin(admin.ModelAdmin):
    ordering = ['-id']
    list_display = ['name', 'category', 'restaurant']


admin.site.register(models.User, UserAdmin)
admin.site.register(models.Restaurant, RestaurantAdmin)
admin.site.register(models.MenuCategory, MenuCategoryAdmin)
admin.site.register(models.MenuItem, MenuItemAdmin)