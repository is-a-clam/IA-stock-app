from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class Stock(models.Model):
    symbol = models.CharField(max_length = 5, primary_key=True)

    # Stock and Company Details
    companyName = models.CharField(max_length = 100, default = "")
    exchange = models.CharField(max_length = 100, default = "")
    description = models.CharField(max_length = 2000, default = "")
    country = models.CharField(max_length = 100, default = "")

    # Daily Stats
    keyStats = models.JSONField(default = list)

    # Minute-based Stats
    quote = models.JSONField(default = list)

    # Over Time Stats
    minuteBar = models.JSONField(default = dict)
    dayBar = models.JSONField(default = dict)

    # Cache Indicator (for current stats)
    lastUpdateDate = models.DateField(auto_now = True)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    tabs = models.JSONField(default = list)
    stocks = models.JSONField(default = dict)
    dash = models.JSONField(default = dict)
