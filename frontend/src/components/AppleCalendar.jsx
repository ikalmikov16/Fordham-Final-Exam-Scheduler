import Button from "react-bootstrap/Button";
import React from "react";

function AppleCalendarButton({ onExport }) {
  return (
    <Button onClick={onExport} variant="primary">
      {" "}
      Add to Apple or Google Calendar{" "}
    </Button>
  );
}

export default AppleCalendarButton;
