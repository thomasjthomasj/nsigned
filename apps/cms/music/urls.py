from django.urls import path

from . import views

app_name = "music"

urlpatterns = [
  path("release-details", views.release_details, name="release_details"),
  path("request-review", views.request_review, name="request_review"),
  path("review-request/claim", views.claim_review_request, name="claim_review_request"),
  path("review-request/reject", views.reject_review_request, name="reject_review_request"),
  path("review-request/pending", views.pending_review_requests, name="pending_review_requests"),
]
