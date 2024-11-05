import { Scheduler } from "@aldabil/react-scheduler";
import React, { useEffect, useState } from "react";
import useGoogleAuth from "../hooks/useGoogleAuth";
import GoogleCalendarButton from "./GoogleCalendar";
import AppleCalendarButton from "./AppleCalendar";
import "../styles/Schedule.css";

// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const CLIENT_ID =
  "31505105774-0b5c57eb0m8jpvpa39rpsd7uoeh2nn55.apps.googleusercontent.com"; // Replace with your Client ID
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

const Schedule = ({ addEventCallback, removeEventCallback }) => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 11, 1));
  const [isSignedIn, setIsSignedIn] = useState(false);
  const { signIn, signOut, exportToGoogleCalendar } = useGoogleAuth(events);
  const colors = ["#FF5733", "#33FF57", "#3357FF"];

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
          <GoogleCalendarButton
            isSignedIn={isSignedIn}
            onExport={isSignedIn ? exportToGoogleCalendar : signIn}
            onSignOut={signOut}
          />
          <AppleCalendarButton onExport={generateICS} />
        </div>
        <div className="schedule">
          <Scheduler
            events={events}
            view="month"
            selectedDate={selectedDate}
            onSelectedDateChange={setSelectedDate}
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
