import { Scheduler } from "@aldabil/react-scheduler";
import React, { useEffect, useState } from "react";
import useGoogleAuth from "../hooks/useGoogleAuth";
import GoogleCalendarButton from "./GoogleCalendar";
import AppleCalendarButton from "./AppleCalendar";
import "../styles/Schedule.css";

// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const SCOPES = import.meta.env.VITE_SCOPES;

const Schedule = ({ addEventCallback, removeEventCallback }) => {
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("month");
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 11, 1));
  const [isSignedIn, setIsSignedIn] = useState(false);

  const { signIn, signOut, exportToGoogleCalendar } = useGoogleAuth(events);
  const colors = ["#FF5733", "#33FF57", "#3357FF"];

  //Sets the view as month

  const addEvent = (course) => {
    const startTime = new Date(course.exam_start_time);
    const endTime = new Date(course.exam_end_time);

    const eventIndex = events.length % colors.length; // Calculate the index for the color
    const eventColor = colors[eventIndex];

    setSelectedDate(startTime);

    const event = {
      event_id: course.id, // or any unique identifier
      title: course.title,
      start: startTime,
      end: endTime,
      location: course.location,
      description: `Course: ${course.major_and_number}, Professor: ${course.professor}`,
      // color: eventColor,
    };
    setEvents((prevEvents) => [...prevEvents, event]);
  };

  const removeEvent = (courseId) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.event_id !== courseId)
    );
  };

  const generateICS = () => {
    // Initialize iCalendar content
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

    // Create a Blob and generate a temporary URL
    const blob = new Blob([icsFileContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);

    // Download ics file
    const a = document.createElement("a");
    a.href = url;
    a.download = "final-exams.ics"; // File name for download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up the temporary URL
    URL.revokeObjectURL(url);

    alert(
      "Add to Apple Calendar - Open the \"final-exams.ics\" file.\nAdd to Google Calendar - Follow instructions on Home Page\n\nDon't worry it's not a virus, I promise :D"
    );
  };

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

  useEffect(() => {
    addEventCallback(addEvent);
  }, [addEventCallback]);

  useEffect(() => {
    removeEventCallback(removeEvent);
  }, [removeEventCallback]);

  useEffect(() => {
    console.log("Events updated: ", events);
  }, [events]);

  return (
    <div className="schedule-container">
      <div className="schedule-buttons-container">
        <div className="export-button">
          {/* <GoogleCalendarButton
            isSignedIn={isSignedIn}
            onExport={isSignedIn ? exportToGoogleCalendar : signIn}
            onSignOut={signOut}
          /> */}
          <AppleCalendarButton onExport={generateICS} />
        </div>

        <div className="schedule">
          <Scheduler
            events={events}
            view={view}
            key={`${view}-${selectedDate}`}
            //Uses a key to change the view
            onViewChange={(newView) => setView(newView)}
            //Triggers a new view when a new selected date is set
            selectedDate={selectedDate}
            month={{
              weekStartOn: 1,
              navigation: true,
              disableGoToDay: false,
              startHour: 8, // Start at 8 AM for month view
              endHour: 22, // End at 10 PM (22 in 24-hour format) for month view
            }}
            week={{
              weekStartOn: 1,
              startHour: 8, // Start at 8 AM for week view
              endHour: 22, // End at 10 PM for week view
            }}
            day={{
              startHour: 8, // Start at 8 AM for day view
              endHour: 22, // End at 10 PM for day view
            }}
            agenda={false}
            editable={false}
            deletable={false}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Schedule;
