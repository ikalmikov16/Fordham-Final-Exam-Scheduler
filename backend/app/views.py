from itertools import chain
import pandas as pd
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
        df = pd.read_excel(file, skiprows=4, usecols="A:H")

        for i, row in df.iterrows():
            try:
                # Format professor name
                last_name, first_name = row["Instructor"].split(",", 1)
                first_name = first_name.strip()
                last_name = last_name.strip()
                professor = f"{first_name} {last_name}"

                course_info = row["Course"].split()
                number = course_info[1]
                section = course_info[2]
                crn = course_info[3]
                if len(crn) != 5:
                    crn = course_info[4]

                major = majors.get(str(row["Department"]).strip(), "")
                if not major:
                    print(row["Department"])

                course = {
                    "title": row["Title"].strip(),
                    "major": major,
                    "professor": professor,
                    "major_tag": row["Department"],
                    "number": number,
                    "major_and_number": f"{row['Department']} {number}",
                    "section": section,
                    "crn": crn,
                    "location": row["Location"],
                    "exam_start_time": row["Start Time"],
                    "exam_end_time": row["End Time"],
                }

                serializer = CourseSerializer(data=course)

                if serializer.is_valid():
                    serializer.save()
                if "crn" not in serializer.errors:
                    print(serializer.errors)
            except Exception as e:
                print(f"Error processing row {i}: {e}")

        return Response(
            {"message": "File processed successfully!"}, status=HTTP_201_CREATED
        )
