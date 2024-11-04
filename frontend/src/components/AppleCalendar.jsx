// src/components/AppleCalendarButton.js
import React from "react";

function AppleCalendarButton({ onExport }) {
  return (
    <button className="btn btn-secondary ms-2" onClick={onExport}>
      Export to Apple Calendar
    </button>
  );
}

export default AppleCalendarButton;
