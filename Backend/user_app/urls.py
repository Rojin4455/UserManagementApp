from django.urls import path
from . import views
from .views import *

urlpatterns = [
    path('getdata/',views.getData),
    path('', Home.as_view()),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/',LoginView.as_view()),
    path('update-profile/', UpdateProfile.as_view(), name='update-profile'),
    path('edit-username/',EditUsername.as_view(),name='edit-username'),
    path('admin-home/',AdminHome.as_view(),name='admin-home'),
    path('admin-change-status/',AdminChangeStatus.as_view(),name='admin-change-status'),


]
