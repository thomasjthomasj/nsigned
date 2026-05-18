from app.decorators import method
from app.http import BadRequest, Ok
from users.models import User
from users.email import send_otp

@method("POST")
def goodsender(request):
  data = request.json
  emails = data.get("nsigned.com", {}).get("granted")
  if not emails:
    return BadRequest()
  for email in emails:
    try:
      user = User.get(email=email)
    except User.DoesNotExist:
      pass
    user.email_consent = True
    user.save()
    otp = user.update_otp()
    send_otp(user, otp)
  return Ok()
