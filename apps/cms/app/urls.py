from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('articles/', include("articles.urls")),
    path("music/", include("music.urls")),
    path('users/', include("users.urls")),
]
