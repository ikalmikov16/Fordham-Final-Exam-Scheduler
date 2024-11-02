import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

// Setup the localizer by providing the moment (or globalize, or Luxon) Object
// to the correct localizer.
const localizer = momentLocalizer(moment);

const Schedule = ({ courses }) => {
  return (
    <div>
      <Calendar
        localizer={localizer}
        // events={}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  );
};

export default Schedule;
