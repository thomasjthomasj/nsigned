import re
from django.core.exceptions import ValidationError

def fundraiser_link_validator(value):
  regexes = [
    r"^https:\/\/paypal\.me", # paypal
    r"^https:\/\/ko-fi\.com", # kofi
    r"^https:\/\/buymeacoffee\.com", # buymeacoffee
    r"^https:\/\/patreon\.com", # patreon
  ]
  if any(re.match(rx, value) for rx in regexes):
    return
  raise ValidationError("Fundraiser link is not")
