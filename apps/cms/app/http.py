from abc import ABC
from django.http import JsonResponse

class BaseResponse(JsonResponse, ABC):
  status = None

  def __init__(self, **kwargs):
    if self.status == None:
      raise NotImplementedError("Status should not be None")
    super().__init__(**kwargs, status=self.status)

class Ok(BaseResponse):
  status = 200

class BaseErrorResponse(BaseResponse, ABC):
  def __init__(self, message, **kwargs):
    base_message = None
    if self.status == None:
      raise NotImplementedError("Base message should not be None")
    super().__init__(
      **kwargs,
      data={
        "error": message if message else base_message
      }
    )

class BadRequest(BaseErrorResponse):
  base_message = "Bad request"
  status = 400

class Unauthorized(BaseErrorResponse):
  base_message = "Unauthorized"
  status = 401

class Forbidden(BaseErrorResponse):
  base_message = "Forbidden"
  status = 403

class NotFound(BaseErrorResponse):
  base_message = "Not found"
  status = 404

class MethodNotAllowed(BaseErrorResponse):
  base_message = "Method not allowed"
  status = 405

class UnsupportedMediaType(BaseErrorResponse):
  base_message = "Unsupported media type"
  status = 415
