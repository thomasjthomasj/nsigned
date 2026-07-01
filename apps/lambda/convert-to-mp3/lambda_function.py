import boto3
import subprocess
import os
s3 = boto3.client("s3")
bucket = "nsigned"

def lambda_handler(event, context):
  record = event["Records"][0]
  key = record["s3"]["object"]["key"]
  print(f"KEY: {key}")

  if not key.startswith("audio/raw/"):
    print("NOT ADDED TO audio/raw/")
    return {
      "statusCode": 200,
      "message": "File not converted - not added to audio/raw/",
    }

  filename = os.path.basename(key)
  track_id = os.path.splitext(filename)[0]

  tmp_input = f"/tmp/{filename}"
  tmp_mp3 = f"/tmp/{track_id}.mp3"

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

  mp3_key = f"audio/mp3s/{track_id}.mp3"
  print(f"MP3 KEY: {mp3_key}")

  s3.upload_file(tmp_mp3, bucket, mp3_key)
  print("SUCCESSFULLY CONVERTED")

  # success
  return {
    "statusCode": 200,
    "message": "File converted to MP3",
  }
