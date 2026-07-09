import boto3
import subprocess
import os
from urllib.parse import unquote_plus

s3 = boto3.client("s3")
bucket = "nsigned"

raw_path = "audio/raw/"
mp3_path = "audio/mp3s/"

def lambda_handler(event, context):
  record = event["Records"][0]
  key = unquote_plus(record["s3"]["object"]["key"])
  print(f"KEY: {key}")

  if not key.startswith(raw_path):
    print("NOT ADDED TO audio/raw/")
    return {
      "statusCode": 200,
      "message": "File not converted - not added to audio/raw/",
    }

  relative_path = key[len(raw_path):]
  track_id = os.path.splitext(relative_path)[0]
  filename = os.path.basename(key)

  tmp_input = f"/tmp/{filename}"
  tmp_mp3 = f"/tmp/{os.path.basename(track_id)}.mp3"

  mp3_key = f"{mp3_path}{track_id}.mp3"
  print(f"MP3 KEY: {mp3_key}")

  s3.download_file(bucket, key, tmp_input)

  subprocess.run([
    "/opt/bin/ffmpeg",
    "-i",
    tmp_input,
    "-codec:a",
    "libmp3lame",
    "-b:a",
    "320k",
    tmp_mp3,
  ], check=True)

  s3.upload_file(tmp_mp3, bucket, mp3_key)
  print("SUCCESSFULLY CONVERTED")

  # success
  return {
    "statusCode": 200,
    "message": "File converted to MP3",
  }
