from abc import ABC
from django.http import JsonResponse

class BaseResponse(JsonResponse, ABC):
  status = None

  def __init__(self, *args, **kwargs):
    if self.status is None:
      raise NotImplementedError("Status should not be None")
    super().__init__(*args, **kwargs, status=self.status)

class Ok(BaseResponse):
  status = 200

  def __init__(self, data={}, *args, **kwargs):
    super().__init__(data, *args, **kwargs);

class BaseErrorResponse(BaseResponse, ABC):
  base_message = None

  def __init__(self, message=None, *args, **kwargs):
    if self.status is None:
      raise NotImplementedError("Base message should not be None")
    super().__init__(
      *args,
      **kwargs,
      data={
        "error": message if message else self.base_message
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

class InternalServerError(BaseErrorResponse):
  base_message = "Internal server error"
  status = 500
