import { useEffect, useRef, useState } from "react";
import "../styles/SchedulerPage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBar from "../components/SearchBar";
import Courses from "../components/Courses";
import Schedule from "../components/Schedule";

const SchedulerPage = () => {
  const [courses, setCourses] = useState([]);
  const addEventRef = useRef(null);
  const removeEventRef = useRef(null);

  const addCourse = (course) => {
    const courseExists = courses.some((c) => c.id === course.id);
    const updatedCourses = [...courses, course];

    if (courseExists) {
      // Alert the user if the course is already selected
      alert("You have already selected this course.");
      return; // Exit the function early
    }

    // Sort the courses by exam_start_time
    updatedCourses.sort((a, b) => {
      return new Date(a.exam_start_time) - new Date(b.exam_start_time);
    });

    setCourses(updatedCourses);

    // Add event in Schedule
    if (addEventRef.current) {
      addEventRef.current(course);
    }
  };

  const removeCourse = (courseId) => {
    console.log("Removing course with id:", courseId);
    setCourses((prevCourses) =>
      prevCourses.filter((course) => course.id !== courseId)
    );

    // Remove course from events
    if (removeEventRef.current) {
      removeEventRef.current(courseId);
    }
  };

  useEffect(() => {
    console.log(courses);
  }, [courses]);

  return (
    <div className="app-container">
      <SearchBar addCourse={addCourse} />
      <div className="courses-schedule-container">
        <Courses courses={courses} removeCourse={removeCourse} />
        <Schedule
          addEventCallback={(fn) => (addEventRef.current = fn)}
          removeEventCallback={(fn) => (removeEventRef.current = fn)}
        />
      </div>
    </div>
  );
};

export default SchedulerPage;
