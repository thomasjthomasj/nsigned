from django.contrib import admin

from .models import User, Notification, FeaturedAuthor, PatreonUser

admin.site.register(User)
admin.site.register(Notification)
admin.site.register(FeaturedAuthor)
admin.site.register(PatreonUser)
