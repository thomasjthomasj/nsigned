from cachetools import LRUCache
from threading import RLock

from .models import User

_cache = LRUCache(maxsize=2000)
_lock = RLock()

def get_user(user_id):
  with _lock:
    user = _cache.get(user_id)
  if user is None:
    user = User.objects.select_related("fundraiser_link").get(id=user_id)
    with _lock:
      _cache[user_id] = user
  return user

def invalidate_user_cache(user_id):
  with _lock:
    _cache.pop(user_id)
