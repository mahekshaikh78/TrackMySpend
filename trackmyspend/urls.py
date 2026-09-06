"""
URL configuration for trackmyspend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from tracker.views import get_transactions , welcome_view , login_view , dashboard_view , add_transaction_view , transactions_page , logout_view , register , register_page
from rest_framework_simplejwt.views import TokenObtainPairView 

urlpatterns = [
    path('admin/', admin.site.urls),
	path('transactions/' ,get_transactions),
	path('login/' , TokenObtainPairView.as_view()),
	path('' , welcome_view),
	path('login_page/' , login_view) ,
	path('dashboard/' , dashboard_view) ,
    path('add_transaction/' ,add_transaction_view , name="add_transaction"),
	path('transactions_history/',transactions_page , name="transactions_page"),
	path('logout/',logout_view),
	path('register/', register, name='register'),
	path('register_page/', register_page, name='register_page'),
	
]

