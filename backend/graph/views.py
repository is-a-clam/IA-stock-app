import requests, json, time
import numpy as np
from datetime import datetime, date, timezone, timedelta
from django.shortcuts import render, get_object_or_404
from rest_framework import generics, permissions, authentication, views, response
from .serializers import StockDayBar, StockMinuteBar, StockName, StockKeyInfo, UserSerializer
from .models import Stock, UserProfile
from .constants import IEX_DOMAIN, IEX_KEY

def updateCompanyInfo(instance):
    payload = {"token": IEX_KEY}
    r = requests.get(IEX_DOMAIN + "/stock/" + instance.symbol + "/company", params=payload)

    try:
        instance.companyName = r.json()["companyName"]
        instance.exchange = r.json()["exchange"]
        instance.description = r.json()["description"]
        instance.country = r.json()["country"]
        instance.save()
    except Exception as e:
        print("ERROR: " + str(e))

def updateKeyStats(instance):
    payload = {"token": IEX_KEY}
    r = requests.get(IEX_DOMAIN + "/stock/" + instance.symbol + "/stats", params=payload)

    try:
        instance.keyStats = r.json()
        instance.save()
    except Exception as e:
        print("ERROR: " + str(e))

def updateStockQuote(instance):
    payload = {"token": IEX_KEY}
    r = requests.get(IEX_DOMAIN + "/stock/" + instance.symbol + "/quote", params=payload)

    try:
        instance.quote = r.json()
        instance.save()
    except Exception as e:
        print("ERROR: " + str(e))

def getDayBar(instance):
    currDayBar = instance.dayBar.copy()
    payload = {"token": IEX_KEY}

    # If no data, get last 5 years
    if not currDayBar:
        r = requests.get(IEX_DOMAIN + "/stock/" + instance.symbol + "/chart/5y", params=payload)
        try:
            data = np.array(r.json())
            newData = {}
            for dayData in np.nditer(data, flags=["refs_ok"], op_flags=["readwrite"]):
                dateString = dayData.item()["date"]
                newData[dateString] = dayData.item()["close"]
            instance.dayBar = newData
            instance.save()
        except Exception as e:
            print("ERROR: " + str(e))
        return

    # Get any remaining un-updated data
    lastDay = date.fromisoformat(list(currDayBar.keys())[-1])
    for n in range(int((date.today() - lastDay).days)):
        dayToGet = lastDay + timedelta(n+1)
        if (dayToGet.weekday() >= 5):
            continue
        getDay = dayToGet.strftime('%Y%m%d')
        url = IEX_DOMAIN + "/stock/" + instance.symbol + "/chart/date/" + getDay + "?chartByDay=true"
        r = requests.get(url, params=payload)

        # If r is not empty
        if r.json():
            try:
                currDayBar[r.json()[0]["date"]] = r.json()[0]["close"]
                instance.dayBar = currDayBar
                instance.save()
            except Exception as e:
                print("ERROR: " + str(e))

def getMinuteBar(instance):
    currMinuteBar = instance.minuteBar.copy()
    payload = {"token": IEX_KEY}


    if not currMinuteBar:
        # If no data, get data from last month
        lastDay = date.today() - timedelta(days = 30)
    else:
        # Else, get data from last updated day
        lastDay = datetime.fromisoformat(list(currMinuteBar.keys())[-1]).date()

    for n in range(int((date.today() - lastDay).days)):
        dayToGet = lastDay + timedelta(n+1)
        if (dayToGet.weekday() >= 5):
            continue
        getDay = dayToGet.strftime('%Y%m%d')
        url = IEX_DOMAIN + "/stock/" + instance.symbol + "/chart/date/" + getDay
        r = requests.get(url, params=payload)

        # If r is not empty
        if r.json():
            try:
                for data in r.json():
                    dateString = data["date"] + "T" + data["minute"] + ":00"
                    currMinuteBar[dateString] = data["close"]
                instance.minuteBar = currMinuteBar
                instance.save()
            except Exception as e:
                print("ERROR: " + str(e))

def marketOpen():
    ETtimezone = timezone(-timedelta(hours=4))
    currTime = datetime.now(ETtimezone)
    # Check if day is between Monday to Friday
    if currTime.weekday() >= 5:
        return False

    # Check if time is between 9am to 4pm
    if currTime.hour >= 16 or currTime.hour < 9:
        return False

    # Check if time is between 9:30am to 4pm
    if currTime.hour == 9 and currTime.minute < 30:
        return False

    return True

class StockAdd(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, format = None):
        newStock = Stock.objects.create(
            symbol = request.data['symbol']
        )

        updateCompanyInfo(newStock)
        updateKeyStats(newStock)
        updateStockQuote(newStock)
        getDayBar(newStock)
        getMinuteBar(newStock)

        return response.Response({"status": "Success"})

class StockList(generics.ListAPIView):
    serializer_class = StockName
    queryset = Stock.objects.all()

class StockKeyInfo(generics.RetrieveAPIView):
    serializer_class = StockKeyInfo
    queryset = Stock.objects.all()

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        # Update if lastUpdateDate is not today
        if instance.lastUpdateDate.isoformat() != date.today().isoformat():
            print("updating date stuff")
            updateCompanyInfo(instance)
            updateKeyStats(instance)
            instance.save()

        # Update if market is open and it has been 15 minutes from last update
        if marketOpen():
            if time.time() - (instance.quote["latestUpdate"] // 1000) >= 900:
                print("updating time stuff")
                updateStockQuote(instance)

        # Update Bar values
        getDayBar(instance)
        getMinuteBar(instance)

        return super().retrieve(request, *args, **kwargs)

class StockDayBar(generics.RetrieveAPIView):
    serializer_class = StockDayBar
    queryset = Stock.objects.all()

class StockMinuteBar(generics.RetrieveAPIView):
    serializer_class = StockMinuteBar
    queryset = Stock.objects.all()

class UserView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    authentication_classes = [authentication.SessionAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        return get_object_or_404(UserProfile.objects.all(), user=user)
