from cachetools import LRUCache
from threading import RLock

from .models import PatreonUser, User

# TODO if the platform ever uses multiple instances this will need to be rethought

_user_cache = LRUCache(maxsize=2000)
_patreon_cache = LRUCache(maxsize=2000)
_lock = RLock()

def get_user(user_id):
  with _lock:
    user = _user_cache.get(user_id)
  if user is None:
    user = User.objects.select_related("fundraiser_link").get(id=user_id)
    with _lock:
      _user_cache[user_id] = user
  return user

def get_patreon_user(user):
  with _lock:
    patreon_user = _patreon_cache(user.id)
  if patreon_user is None:
    patreon_user = PatreonUser.objects.get(user=user)
    with _lock:
      _patreon_cache[user.id] = patreon_user
  return patreon_user

def invalidate_user_cache(user_id):
  with _lock:
    _user_cache.pop(user_id)
