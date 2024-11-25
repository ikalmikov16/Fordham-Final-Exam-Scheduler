import React from "react";
import "../styles/Courses.css";

const Courses = ({ courses, removeCourse }) => {
  return (
    <div className="courses-container">
      <div className="course-list">
        <h2>My Exams</h2>

        {courses.map((course) => {
          const startTime = new Date(course.exam_start_time);
          const endTime = new Date(course.exam_end_time);

          // Format date to "Day, Month Date" (e.g., "Tuesday, December 10") in EST
          const formattedDate = startTime.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          });

          // Format start and end times to "HH:MM AM/PM" in EST
          const formattedStartTime = startTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });
          const formattedEndTime = endTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div key={course.id} className="course-item">
              <div
                className="remove-button"
                onClick={() => removeCourse(course.id)}
              >
                <div className="minus" />
              </div>

              <div className="course-left">
                <div className="course-title">{course.title}</div>
                <div className="course-info">Prof. {course.professor}</div>
                <div className="course-info">
                  {course.major_and_number}, {course.section}
                </div>
                <div className="course-info">CRN: {course.crn}</div>
              </div>

              <div className="course-right">
                <div className="course-exam">{formattedDate}</div>
                <div className="course-exam">
                  {formattedStartTime} - {formattedEndTime}
                </div>
                <div className="course-info">{course.location}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Courses;
