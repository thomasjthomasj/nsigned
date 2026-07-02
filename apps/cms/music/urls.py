from django.urls import path

from . import views

app_name = "music"

urlpatterns = [
  path("release-details", views.release_details, name="release_details"),
  path("request-review", views.request_review, name="request_review"),
  path("review-request/<int:id>", views.get_review_request, name="review_request"),
  path("review-request/claimed", views.get_claimed_review_requests, name="get_claimed_review_requests"),
  path("review-request/claim", views.claim_review_request, name="claim_review_request"),
  path("review-request/unclaim", views.unclaim_review_request, name="unclaim_review_request"),
  path("review-request/reject", views.reject_review_request, name="reject_review_request"),
  path("review-request/cancel", views.cancel_review_request, name="cancel_review_request"),
  path("review-request/pending", views.pending_review_requests, name="pending_review_requests"),
  path("review-request/current", views.user_review_request, name="user_view_request"),
  path("review-requests/count", views.count_review_requests, name="count_review_requests"),
  path("artists", views.artists, name="artists"),
  path("track/start_upload", views.start_upload, name="start_upload"),
]
