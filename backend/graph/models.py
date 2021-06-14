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

    # Key Stats
    keyStats = models.JSONField(default = list)
    quote = models.JSONField(default = list)

    # Graph Stats
    minuteBar = models.JSONField(default = list)
    dayBar = models.JSONField(default = list)

    lastUpdateDate = models.DateField(auto_now = True)

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    tabs = models.JSONField()
