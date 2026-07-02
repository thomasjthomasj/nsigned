import boto3
from . import settings

s3_audio = boto3.client(
  "s3",
  aws_access_key_id=settings.AWS_S3_AUDIO_ACCESS_KEY,
  aws_secret_access_key=settings.AWS_S3_AUDIO_ACCESS_SECRET,
  region_name=settings.AWS_S3_REGION,
)
