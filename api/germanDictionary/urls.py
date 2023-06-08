
from django.contrib import admin
from django.urls import path
from dictApp import views
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('allwords/', views.germanWords),
    path('allwords/<int:id>', views.germanWordsById),
    path('importdictionary/', views.importDictionary),
    path('wordsbylevel/<int:level>', views.getLevel),
    path('register/', views.manageUser),
    path('login/', views.getUser),
    path('api/token/', jwt_views.TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('user/', views.UserApiView.as_view(), name='login')
]

urlpatterns = format_suffix_patterns(urlpatterns)