from django.urls import path
from .views import CourseView

urlpatterns = [
    path("courses/<int:id>/", CourseView.as_view(), name="course-id"),
    path("courses/", CourseView.as_view(), name="courses"),
]
