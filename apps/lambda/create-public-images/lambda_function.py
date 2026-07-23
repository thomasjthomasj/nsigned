import boto3
import subprocess
import os
from PIL import Image
from io import BytesIO
from urllib.parse import unquote_plus

s3 = boto3.client("s3")
bucket = "nsigned"
public_bucket = "nsigned-public"

path = "images/"

def lambda_handler(event, context):
  record = event["Records"][0]
  key = unquote_plus(record["s3"]["object"]["key"])
  print(f"KEY {key}")

  if not key.startswith(path):
    print("NOT ADDED TO images/")
    return {
      "statusCode": 200,
      "message": "File not resized - not added to images/",
    }

  relative_path = key[len(path):]
  lg_id = os.path.splitext(relative_path)[0]
  md_id = lg_id.replace("_lg$", "_md")
  sm_id = lg_id.replace("_lg$", "_sm")
  size_map = (
    (lg_id, 1200)
    (md_id, 350),
    (sm_id, 124),
  )

  response = s3.get_object(Bucket=bucket, Key=key)
  img_data = response["Body"].read()
  base_img = Image.open(BytesIO(img_data))

  for img_id, size in size_map:
    img = base_img if size == 1200 else base_img.resize((size, size), Image.LANCZOS)
    buffer = BytesIO()
    img.save(buffer, format="JPEG")
    buffer.seek(0)
    new_key = f"{path}{img_id}.jpg"
    s3.put_object(
      Bucket=public_bucket,
      Key=new_key,
      Body=buffer,
      ContentType="image/jpeg",
    )
    print(f"Saved {size}x{size}px image to public bucket")

  return {
    "statusCode": 200,
    "message": "Successfully resized images",
  }
