import React from "react";

const Courses = ({ courses }) => {
  return (
    <div className="courses-list">
      {courses.map((course) => {
        // Parse the start and end times
        const startTime = new Date(course.exam_start_time);
        const endTime = new Date(course.exam_end_time);

        // Format date to "Day, Month Date" (e.g., "Tuesday, December 10")
        const formattedDate = startTime.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });

        // Format start and end times to "HH:MM AM/PM"
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
            <h3 className="course-title">{course.title}</h3>
            <p className="course-info">
              <strong>Course:</strong> {course.major_and_number} |{" "}
              <strong>CRN:</strong> {course.crn}
            </p>
            <p className="course-info">
              <strong>Professor:</strong> {course.professor}
            </p>
            <p className="course-info">
              <strong>Location:</strong> {course.location}
            </p>
            <p className="course-exam">
              <strong>Exam Date:</strong> {formattedDate}
            </p>
            <p className="course-exam">
              <strong>Exam Time:</strong> {formattedStartTime} -{" "}
              {formattedEndTime}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Courses;
