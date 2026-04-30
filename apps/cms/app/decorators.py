from .http import Unauthorized, Forbidden, MethodNotAllowed

_role_map = {
  "user": ["user", "contributor", "editor"],
  "contributor": ["contributor", "editor"],
  "editor": ["editor"],
}

def logged_in(role="user"):
  def decorator(view):
    def wrapped(request, *args, **kwargs):
      user = getattr(request, "site_user", None)
      print(user)
      if not user:
        return Unauthorized()
      allowed_roles = _role_map[role]
      if not user.role in allowed_roles:
        return Forbidden()
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
