// src/components/GoogleCalendarButton.js
import React from "react";

function GoogleCalendarButton({ isSignedIn, onExport, onSignOut }) {
  return (
    <div>
      <button className="btn btn-primary" onClick={onExport}>
        {isSignedIn
          ? "Export to Google Calendar"
          : "Sign In & Export to Google Calendar"}
      </button>
      {isSignedIn && (
        <button className="btn btn-danger ms-2" onClick={onSignOut}>
          Sign Out
        </button>
      )}
    </div>
  );
}

export default GoogleCalendarButton;
