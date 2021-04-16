from django.db import models


class Stock(models.Model):
    symbol = models.CharField(max_length=4)
    companyName = models.CharField(max_length=50)

    def _str_(self):
        return self.symbol
