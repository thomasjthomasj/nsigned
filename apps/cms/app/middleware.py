import json
import traceback
from app.http import BadRequest, UnsupportedMediaType, InternalServerError

class JsonMiddleware:
  def __init__(self, get_response):
    self.get_response = get_response

  def __call__(self, request):
    if request.path.startswith("/admin"):
      return self.get_response(request)

    try:
      data = None
      if request.body:
        if request.content_type != "application/json":
          return UnsupportedMediaType("Content-Type must be application/json")
        try:
          data = json.loads(request.body.decode("utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
          return BadRequest("Invalid JSON")
      request.json = data
      return self.get_response(request)
    except:
      return InternalServerError()

  def process_exception(self, request, exception):
    traceback.print_exc()
    return InternalServerError()
