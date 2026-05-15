import json
import traceback
from django.core.cache import cache
from .http import Ok, Unauthorized, Forbidden, MethodNotAllowed
from .utils import has_permission, get_cache_key

def logged_in(role="contributor"):
  def decorator(view):
    def wrapped(request, *args, **kwargs):
      user = getattr(request, "site_user", None)
      if not user:
        return Unauthorized()
      if not has_permission(user, role):
        return Forbidden()
      return view(request, *args, **kwargs)
    return wrapped
  return decorator

def logged_out():
  def decorator(view):
    def wrapped(request, *args, **kwargs):
      user = getattr(request, "site_user", None)
      if user:
        return Unauthorized("You must not be logged in")
      return view(request, *args, **kwargs)
    return wrapped
  return decorator

def method(method):
  def decorator(view):
    def wrapped(request, *args, **kwargs):
      if request.method != method:
        return MethodNotAllowed(f"Must be %s request" % method)
      return view(request, *args, **kwargs)
    return wrapped
  return decorator

def cached(key, id_kwarg=None, get_params=[], timeout=3600):
  def decorator(view):
    def wrapped(request, *args, **kwargs):
      try:
        try:
          id_val = kwargs[id_kwarg] if id_kwarg else None
        except KeyError:
          return view(request, *args, **kwargs)
        cache_key = get_cache_key(
          key,
          id_val=id_val,
          get_params=get_params,
          get_data=request.GET
        )
        cached_body = cache.get(cache_key)
        try:
          if cached_body:
            return Ok(json.loads(cached_body))
        except:
          pass
        response = view(request, *args, **kwargs)
        cache.set(cache_key, response.content, timeout=timeout)
        return response
      except:
        traceback.print_exc()
        return view(request, *args, **kwargs)
    return wrapped
  return decorator
