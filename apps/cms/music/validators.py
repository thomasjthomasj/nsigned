from django.core.exceptions import ValidationError

def images_validator(value):
  def validate(image):
    required_fields = ["url", "height", "width"]
    for field in required_fields:
      if not image.get(field):
        raise ValidationError(f"`%s` field required on image")

  if not isinstance(value, dict):
    raise ValidationError("Images must be a dict")
  required_sizes = ["sm", "md", "lg"]

  for size in required_sizes:
    if not value.get(size):
      raise ValidationError(f"`%s` size is required")
    validate(value.get(size))
