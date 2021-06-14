from rest_framework import serializers
from .models import Stock, UserProfile

class StockName(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = (
            'symbol',
        )

class StockKeyInfo(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = (
            'companyName',
            'exchange',
            'description',
            'country',
            'keyStats',
            'quote',
        )

class StockDayBar(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = (
            'dayBar',
        )

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = (
            'tabs',
        )
