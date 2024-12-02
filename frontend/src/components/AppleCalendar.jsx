import Button from "react-bootstrap/Button";
import React from "react";

function AppleCalendarButton({ onExport }) {
  return (
    <Button onClick={onExport} variant="primary">
      {" "}
      Download Schedule{" "}
    </Button>
  );
}

export default AppleCalendarButton;
