from datetime import datetime, timezone, timedelta
from django.db import close_old_connections
from app.patreon import refresh_access_token
from .models import PatreonUser

def refresh_patreon_user(patreon_user_id, invalidate):
  now = datetime.now(timezone.utc)
  try:
    close_old_connections()
    patreon_user = PatreonUser.objects.get(id=patreon_user_id)
    refresh_time = patreon_user.token_expires_at - timedelta(hours=1)
    if patreon_user.expires_at <= now and refresh_time <= now:
      new_tokens = refresh_access_token(patreon_user.refresh_token)
      patreon_user.update_tokens(new_tokens)
      if invalidate:
        invalidate()
  finally:
    close_old_connections()
