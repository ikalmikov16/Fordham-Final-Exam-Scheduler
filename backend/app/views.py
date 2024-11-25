from itertools import chain
import pandas as pd
import pytz
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
)
from .serializers import CourseSerializer
from django.db.models import Q
from .models import Course
from fuzzywuzzy import process
from .variables import majors


class CourseView(APIView):
    def get(self, request, *args, **kwargs):
        """
        Handle Course get request. Determine whether to get search recommendations or course by id.
        """
        # Check for search query
        query = request.GET.get("q", None)

        if query is not None:
            query = str(query)
            return self.get_search_recommendations(query)

        course_id = kwargs.get("id", None)

        if course_id is not None:
            course_id = int(course_id)
            return self.get_course_by_id(course_id)

        return Response({"error": "Invalid request"}, status=HTTP_400_BAD_REQUEST)

    def get_course_by_id(self, course_id):
        """
        Get a Course by id
        """
        try:
            course = Course.objects.get(id=course_id)
            serializer = CourseSerializer(course)

            return Response(serializer.data)
        except Course.DoesNotExist:
            return Response(
                {"error": "Course does not exist"}, status=HTTP_404_NOT_FOUND
            )

    def get_search_recommendations(self, query):
        """
        Get a list of Courses as search recommendations
        """
        # Validate search query
        if not query:
            return Response(
                {"error": "Search query is required."}, status=HTTP_400_BAD_REQUEST
            )

        query = query.strip()

        # Get list of all search possibilities from titles, professors, majors, majors and numbers, crns
        all_titles = Course.objects.values_list("title", flat=True)
        all_professors = Course.objects.values_list("professor", flat=True)
        all_majors = Course.objects.values_list("major", flat=True)
        all_majors_numbers = Course.objects.values_list("major_and_number", flat=True)
        all_crns = Course.objects.values_list("crn", flat=True)

        all_results = list(
            chain(all_titles, all_professors, all_majors, all_majors_numbers, all_crns)
        )

        # Compare query to all possibilites with fuzzywuzzy
        matched_results = process.extract(query, all_results)

        # Filter results with score > 70
        filtered_results = []
        for result in matched_results:
            score = result[1]
            if score > 70:
                filtered_results.append(result)

        # Remove duplicates and sort by score in descending order
        results = list(set(filtered_results))
        results.sort(key=lambda x: x[1], reverse=True)

        courses = []
        seen_ids = set()

        # Query course objects in order of best results
        for result, _ in results:
            matching_courses = Course.objects.filter(
                Q(title__exact=result)
                | Q(professor__exact=result)
                | Q(major__exact=result)
                | Q(major_and_number__exact=result)
                | Q(crn__exact=result)
            ).distinct()

            # Add only new courses, checking by ID to avoid duplicates
            for course in matching_courses:
                if course.id not in seen_ids:
                    courses.append(course)
                    seen_ids.add(course.id)

        # Serialize the filtered and ordered courses
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)

    def post(self, request):
        """
        Process courses sheet and add them to database
        """
        if "exam-schedule" not in request.FILES:
            return Response({"error": "No file provided"}, status=HTTP_400_BAD_REQUEST)

        file = request.FILES["exam-schedule"]
        df = pd.read_excel(file, skiprows=3, usecols="A:H")

        for i, row in df.iterrows():
            try:
                # Get course details
                course_info = row["Course"].split()
                number = course_info[1]
                section = course_info[2]
                crn = course_info[3]
                if len(crn) != 5:
                    crn = course_info[4]
                    if len(crn) != 5:
                        crn = course_info[5]

                # Mark exam times as EST and convert to UTC
                start_time_est = pytz.timezone("America/New_York").localize(
                    row["Start Time"]
                )
                end_time_est = pytz.timezone("America/New_York").localize(
                    row["End Time"]
                )
                start_time_utc = start_time_est.astimezone(pytz.UTC)
                end_time_utc = end_time_est.astimezone(pytz.UTC)
                
                major_tag = row["Department"]
                if len(major_tag) > 4:
                    major_tag = course_info[0] 
                major = majors.get(str(major_tag).strip(), "")
                if not major:
                    print(major_tag)


                course = {
                    "title": row["Title"].strip(),
                    "major": major,
                    "professor": row["Instructor"],
                    "major_tag": major_tag,
                    "number": number,
                    "major_and_number": f"{major_tag} {number}",
                    "section": section,
                    "crn": crn,
                    "location": row["Location"],
                    "exam_start_time": start_time_utc,
                    "exam_end_time": end_time_utc,
                }

                serializer = CourseSerializer(data=course)

                if serializer.is_valid():
                    serializer.save()
                if "crn" not in serializer.errors or not serializer.errors:
                    print(i, course, "\n", serializer.errors)
            except Exception as e:
                print(f"Error processing row {i}: {e}")
        return Response(
            {"message": "File processed successfully!"}, status=HTTP_201_CREATED
        )
