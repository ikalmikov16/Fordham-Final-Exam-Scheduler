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
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 11, 1));

  const addCourse = (course) => {
    setCourses((prevCourses) => [...prevCourses, course]);
    const startTime = new Date(course.exam_start_time);
    const endTime = new Date(course.exam_end_time);

    setSelectedDate(startTime);

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
      <div className="search-bar-container">
        <SearchBar addCourse={addCourse} />
      </div>

      {/* Main content container */}
      <div className="main-content">
        <div className="courses-container">
          <Courses courses={courses} removeCourse={removeCourse} />
        </div>
        <div className="calendar-container">
          <Scheduler
            events={events}
            view="month"
            selectedDate={selectedDate}
            onSelectedDateChange={setSelectedDate}
          />
        </div>
      </div>
    </>
  );
}

export default App;
