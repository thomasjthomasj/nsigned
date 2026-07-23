from slugify import slugify
from django.db import transaction
from app.decorators import method, logged_in
from app.http import Ok, BadRequest
from app.s3 import s3_images
from .models import ImageUpload

@method("POST")
@logged_in()
@transaction.atomic()
def start_upload(request):
  data = request.json
  user = request.site_user
  filename = data.get("filename")
  filetype = data.get("filetype")
  if filetype not in ["jpg", "png"]:
    return BadRequest("Image must be either .jpg or .png file")
  base_location = f"images/{slugify(user.username)}/{slugify(filename)}"
  lg_location = f"{base_location}_lg.{filetype}"
  md_location = f"{base_location}_md.{filetype}"
  sm_location = f"{base_location}_sm.{filetype}"

  exists = ImageUpload.objects.filter(lg_location=lg_location).exists()
  if exists:
    return BadRequest(f"Image already exists with that location")

  image_upload = ImageUpload.objects.create(
    created_by=user,
    filetype=filetype,
    lg_location=lg_location,
    md_location=md_location,
    sm_location=sm_location,
  )

  presigned_url = s3_images.generate_presigned_url(
    "put_object",
    Params={
      "Bucket": "nsigned",
      "Key": lg_location,
      "ContentType": "image/jpeg" if filetype == "jpg" else "image/png",
    },
    ExpiresIn=3600,
  )

  return Ok({
    "upload_url": presigned_url,
    "image_upload_id": image_upload.id,
  })
