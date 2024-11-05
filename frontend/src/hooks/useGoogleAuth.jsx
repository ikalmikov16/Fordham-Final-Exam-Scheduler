// src/hooks/useGoogleAuth.js
import { useEffect, useState } from "react";
import { gapi } from "gapi-script";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const SCOPES = import.meta.env.VITE_SCOPES;

export default function useGoogleAuth(events) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    function initClient() {
      gapi.client
        .init({ clientId: CLIENT_ID, scope: SCOPES })
        .then(() => {
          const authInstance = gapi.auth2.getAuthInstance();
          authInstance.isSignedIn.listen(setIsSignedIn);
          setIsSignedIn(authInstance.isSignedIn.get());
          return gapi.client.load("calendar", "v3");
        })
        .catch((error) => {
          console.error("Error initializing GAPI client:", error);
          alert("Failed to initialize Google API client.");
        });
    }

    gapi.load("client:auth2", initClient);
  }, []);

  const signIn = () => gapi.auth2.getAuthInstance().signIn();
  const signOut = () => gapi.auth2.getAuthInstance().signOut();

  const insertEvents = () => {
    let successCount = 0;
    const totalEvents = events.length; // Store the total number of events

    events.forEach((event) => {
      const eventResource = {
        summary: event.title,
        location: event.location,
        description: event.description,
        start: {
          dateTime: event.start.toISOString(),
          timeZone: "America/New_York",
        },
        end: {
          dateTime: event.end.toISOString(),
          timeZone: "America/New_York",
        },
      };

      gapi.client.calendar.events
        .insert({
          calendarId: "primary",
          resource: eventResource,
        })
        .then(() => {
          successCount++;
          // Check if all events have been processed
          if (successCount === totalEvents) {
            alert(
              "All events have been successfully added to Google Calendar!"
            );
          }
        })
        .catch((error) => {
          console.error(`Failed to create event "${event.title}":`, error);
          alert(
            `Failed to create event "${event.title}": ${error.result.error.message}`
          );
          // Check if all events have been processed even if one failed
          if (successCount + 1 === totalEvents) {
            alert(
              "Some events failed to add. Please check the console for details."
            );
          }
        });
    });
  };

  const exportToGoogleCalendar = () => {
    if (!isSignedIn) {
      signIn().then(() => {
        insertEvents();
      });
    } else {
      insertEvents();
    }
  };

  return { isSignedIn, signIn, signOut, exportToGoogleCalendar };
}
