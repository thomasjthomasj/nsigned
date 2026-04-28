from django.http import JsonResponse, HttpResponseNotAllowed

_role_map = {
  "user": ["user", "contributor", "editor"],
  "contributor": ["contributor", "editor"],
  "editor": ["editor"],
}

def logged_in(role="user"):
  def decorator(view):
    def wrapped(request, *args, **kwargs):
      user = getattr(request, "user", None)
      if not user:
        return JsonResponse({"error": "unauthorized"}, status=401)
      allowed_roles = _role_map[role]
      if not user.role in allowed_roles:
        return JsonResponse({"error": "forbidden"}, status=403)
      return view(request, *args, **kwargs)
    return wrapped
  return decorator

def method(method):
  def decorator(view):
    def wrapped(request, *args, **kwargs):
      if request.method != method:
        return HttpResponseNotAllowed([method])
      return view(request, *args, **kwargs)
    return wrapped
  return decorator
