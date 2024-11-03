import { useEffect, useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBar from "./components/SearchBar";
import Courses from "./components/Courses";
import Schedule from "./components/Schedule";
import { Scheduler, View } from "@aldabil/react-scheduler";

function App() {
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);

  const addCourse = (course) => {
    setCourses((prevCourses) => [...prevCourses, course]);
    const startTime = new Date(course.exam_start_time);
    const endTime = new Date(course.exam_end_time);
    const event = {
      id: course.id, // or any unique identifier
      title: course.title,
      start: startTime,
      end: endTime,
      location: course.location,
      description: `Course: ${course.major_and_number}, Professor: ${course.professor}`,
    };
    setEvents((prevEvents) => [...prevEvents, event]);
  };

  const removeCourse = (courseId) => {
    console.log("Removing course with id:", courseId);
    setCourses((prevCourses) =>
      prevCourses.filter((course) => course.id !== courseId)
    );
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== courseId)
    );
  };

  useEffect(() => {
    console.log(courses);
  }, [courses]);

  useEffect(() => {
    console.log("Events updated: ", events);
  }, [events]);

  return (
    <>
      <NavBar />

      <div className="app-container">
        <SearchBar addCourse={addCourse} />
        <Courses courses={courses} removeCourse={removeCourse} />
        {/* <Schedule courses={courses}/> */}
        <Scheduler events={events} view="month">
          <View />
        </Scheduler>
      </div>
    </>
  );
}

export default App;
