from app.decorators import method, logged_in
from app.http import Ok
from .models import ImageUpload

@method("POST")
@logged_in()
def start_upload(request):
  return Ok()
