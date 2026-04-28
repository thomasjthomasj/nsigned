import jwt
from django.conf import settings
from .models import User

class AuthMiddleware:
  def __init__(self, get_response):
    self.get_response = get_response

  def __call__(self, request):
    request.user = None

    auth = request.headers.get("Authorization")
    if auth and auth.startswith("Bearer "):
      token = auth.split(" ")[1]

      try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        request.user = User.objects.get(id=payload["user_id"])
      except:
        pass

    return self.get_response(request)
