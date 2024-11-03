import { useEffect, useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { gapi } from "gapi-script";
import SearchBar from "./components/SearchBar";
import Courses from "./components/Courses";
import Schedule from "./components/Schedule";
import { Scheduler, View } from "@aldabil/react-scheduler";

const CLIENT_ID =
  "31505105774-0b5c57eb0m8jpvpa39rpsd7uoeh2nn55.apps.googleusercontent.com"; // Replace with your Client ID
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

function App() {
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 11, 1));
  const [isSignedIn, setIsSignedIn] = useState(false);
  const colors = ["#FF5733", "#33FF57", "#3357FF"];

  useEffect(() => {
    function initClient() {
      gapi.client
        .init({
          clientId: CLIENT_ID,
          scope: SCOPES,
        })
        .then(() => {
          gapi.auth2.getAuthInstance().isSignedIn.listen(setIsSignedIn);
          setIsSignedIn(gapi.auth2.getAuthInstance().isSignedIn.get());
        });
    }

    gapi.load("client:auth2", initClient);
  }, []);

  const addCourse = (course) => {
    setCourses((prevCourses) => [...prevCourses, course]);
    const startTime = new Date(course.exam_start_time);
    const endTime = new Date(course.exam_end_time);

    const eventIndex = events.length % colors.length; // Calculate the index for the color
    const eventColor = colors[eventIndex];

    setSelectedDate(startTime);

    const event = {
      id: course.id, // or any unique identifier
      title: course.title,
      start: startTime,
      end: endTime,
      location: course.location,
      description: `Course: ${course.major_and_number}, Professor: ${course.professor}`,
      color: eventColor,
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

  const handleAuthClick = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  const exportToGoogleCalendar = () => {
    if (!isSignedIn) {
      alert("You need to sign in first.");
      return;
    }

    events.forEach((event) => {
      const eventResource = {
        summary: event.title,
        location: event.location,
        description: event.description,
        start: {
          dateTime: event.start.toISOString(),
          timeZone: "America/New_York", // Adjust to your timezone
        },
        end: {
          dateTime: event.end.toISOString(),
          timeZone: "America/New_York", // Adjust to your timezone
        },
      };

      gapi.client.calendar.events
        .insert({
          calendarId: "primary",
          resource: eventResource,
        })
        .then(
          (response) => {
            console.log("Event created: ", response);
          },
          (error) => {
            console.error("Error creating event: ", error);
          }
        );
    });
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
      <SearchBar addCourse={addCourse} />
      <div className="search-bar-container">
        {isSignedIn ? (
          <button className="btn btn-danger me-2" onClick={handleSignOut}>
            Sign Out
          </button>
        ) : (
          <button className="btn btn-primary me-2" onClick={handleAuthClick}>
            Sign In with Google
          </button>
        )}
        <button className="btn btn-success" onClick={exportToGoogleCalendar}>
          Export to Google Calendar
        </button>
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
