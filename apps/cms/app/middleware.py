import json
from django.http import JsonResponse

class JsonMiddleware:
  def __init__(self, get_response):
    self.get_response = get_response

  def __call__(self, request):
    if request.path.startswith("/admin"):
      return self.get_response(request)
    data = None
    if request.body:
      if request.content_type != "application/json":
        return JsonResponse({"error": "Content-Type must be application/json"}, status=415)
      try:
        data = json.loads(request.body.decode("utf-8"))
      except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    request.json = data
    return self.get_response(request)
