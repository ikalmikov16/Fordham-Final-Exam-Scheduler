import { useEffect, useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { gapi } from "gapi-script";
import SearchBar from "./components/SearchBar";
import Courses from "./components/Courses";
import useGoogleAuth from "./hooks/useGoogleAuth";
import GoogleCalendar from "./components/GoogleCalendar";
import AppleCalendar from "./components/AppleCalendar";
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
  const { signIn, signOut, exportToGoogleCalendar } = useGoogleAuth(events);

  const colors = ["#FF5733", "#33FF57", "#3357FF"];

  useEffect(() => {
    function initClient() {
      gapi.client
        .init({
          clientId: CLIENT_ID,
          scope: SCOPES,
        })
        .then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          authInstance.isSignedIn.listen(setIsSignedIn);
          setIsSignedIn(authInstance.isSignedIn.get());

          // Load the Calendar API
          return gapi.client.load("calendar", "v3");
        })
        .catch((error) => {
          console.error("Error initializing GAPI client:", error);
          alert(
            "Failed to initialize Google API client. Please check your credentials."
          );
        });
    }

    gapi.load("client:auth2", initClient);
  }, []);

  const addCourse = (course) => {
    const courseExists = courses.some(c => c.id === course.id);
    const updatedCourses = [...courses, course];

    if (courseExists) {
        // Alert the user if the course is already selected
        alert('You have already selected this course.');
        return; // Exit the function early
    }

    // Sort the courses by exam_start_time
    updatedCourses.sort((a, b) => {
      return new Date(a.exam_start_time) - new Date(b.exam_start_time);
    });

    setCourses(updatedCourses);

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

  useEffect(() => {
    console.log(courses);
  }, [courses]);

  useEffect(() => {
    console.log("Events updated: ", events);
  }, [events]);

  const generateICS = () => {
    let icsFileContent = "BEGIN:VCALENDAR\nVERSION:2.0\n";
    events.forEach((event) => {
      icsFileContent +=
        "BEGIN:VEVENT\n" +
        `SUMMARY:${event.title}\n` +
        `LOCATION:${event.location}\n` +
        `DESCRIPTION:${event.description}\n` +
        `DTSTART:${event.start.toISOString().replace(/-|:|\.\d{3}/g, "")}\n` +
        `DTEND:${event.end.toISOString().replace(/-|:|\.\d{3}/g, "")}\n` +
        "END:VEVENT\n";
    });
    icsFileContent += "END:VCALENDAR";

    const blob = new Blob([icsFileContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "events.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <NavBar />
      <SearchBar addCourse={addCourse} />
      <div className="search-bar-container">
        <GoogleCalendar
          isSignedIn={isSignedIn}
          onExport={isSignedIn ? exportToGoogleCalendar : signIn}
          onSignOut={signOut}
        />
        <AppleCalendar onExport={generateICS} />
      </div>

      {/* Main content container */}
      <div className="main-content">
        <div className="courses-container">
          <Courses courses={courses} removeCourse={removeCourse} />
        </div>
        <div className="calendar-container">
          <div className="calendar">
            <Scheduler
              events={events}
              view="month"
              selectedDate={selectedDate}
              onSelectedDateChange={setSelectedDate}
              agenda={false}
              month={{
                startHour: 8, // Start at 8 AM for month view
                endHour: 22, // End at 10 PM (22 in 24-hour format) for month view
              }}
              week={{
                startHour: 8, // Start at 8 AM for week view
                endHour: 22, // End at 10 PM for week view
              }}
              day={{
                startHour: 8, // Start at 8 AM for day view
                endHour: 22, // End at 10 PM for day view
              }}
              height={500}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
