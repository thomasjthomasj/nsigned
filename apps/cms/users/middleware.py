import jwt
from django.conf import settings
from .cache import get_user, get_patreon_user

class AuthMiddleware:
  def __init__(self, get_response):
    self.get_response = get_response

  def __call__(self, request):
    request.site_user = None

    token = request.COOKIES.get("access-token")
    if token:
      try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        request.site_user = get_user(payload["user_id"])
        try:
          request.patreon_user = get_patreon_user(request.site_user)
        except Exception as e:
          request.patreon_user = None
          pass
      except:
        pass

    return self.get_response(request)
