import Button from "react-bootstrap/Button";
import React from "react";

function AppleCalendarButton({ onExport }) {
  return (
    <Button onClick={onExport} variant="primary">
      {" "}
      Add to Apple Calendar{" "}
    </Button>
  );
}

export default AppleCalendarButton;
