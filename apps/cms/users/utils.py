import random

def get_otp():
  return f"{random.randint(0, 999999):06}"
