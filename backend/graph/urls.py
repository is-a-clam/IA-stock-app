from django.urls import path
from . import views

app_name = "accounts"

urlpatterns = [
    path("user-profile/", views.UserView.as_view(), name="user profile"),
    path("user-stocks/", views.UserStockView.as_view(), name="user stocks"),
    path("add-stock/", views.StockAdd.as_view(), name="add stock"),
    path("list-stocks/", views.StockList.as_view(), name="list stocks"),
    path("get-stock-key-info/<pk>/", views.StockKeyInfo.as_view(), name="stock key info"),
    path("get-stock-day-bar/<pk>/", views.StockDayBar.as_view(), name="stock day bar"),
    path("get-stock-minute-bar/<pk>/", views.StockMinuteBar.as_view(), name="stock minute bar"),
]
