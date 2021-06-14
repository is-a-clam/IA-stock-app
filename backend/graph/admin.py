from django.contrib import admin
from .models import Stock, UserProfile

class StockAdmin(admin.ModelAdmin):
    list_display = ('symbol', 'companyName', 'lastUpdateDate')

class UserAdmin(admin.ModelAdmin):
    list_display = ('user', 'tabs')

admin.site.register(Stock, StockAdmin)
admin.site.register(UserProfile, UserAdmin)
