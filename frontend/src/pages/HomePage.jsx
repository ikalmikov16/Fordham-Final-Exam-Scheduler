import React from "react";
import Button from "react-bootstrap/Button";
import "../styles/HomePage.css";
import { useNavigate } from "react-router-dom";
import demo from "../assets/demo.png";

const HomePage = () => {
  const navigate = useNavigate();

  const navigateScheduler = () => {
    navigate("/schedule");
  };
  return (
    <div className="home-container">
      <h1> Welcome to Fordham Final Exam Scheduler </h1>
      <p>
        Final exams can be stressful, but organizing your schedule doesn't have
        to be! We've created a simple and efficient tool for you to quickly
        create your final exam schedules and add them to their external
        calendars.
      </p>

      <div className="home-image">
        <img src={demo} alt="Demo" />
      </div>
      <br />

      <h2> How It Works? </h2>
      <ol>
        <li>
          <p>
            <b>Search Courses:</b> Find your courses using any parameter -
            course title, professor's last name, major, major tag and course
            number, or CRN.
          </p>
        </li>
        <li>
          <p>
            <b>Visualize Schedule:</b> Select your courses and your final exams
            will appear on a calendar with dates, times, and locations.
          </p>
        </li>
        <li>
          <p>
            <b>Export Calendar:</b> Add to your Apple or Google Calendar or save a
            screenshot of your final exam schedule.
          </p>
        </li>
      </ol>

      <h2> How To Add to Google Calendar? </h2>
      <ol>
        <li>
          <p>
            Select your courses and click <b>Add to Apple or Google Calendar</b>. This will download a <b>final-exams.ics</b> file.
          </p>
        </li>
        <li>
          <p>
            Open <a href="https://calendar.google.com">Google Calendar</a>. 
          </p>
        </li>
        <li>
          <p>
            Go to <b>Settings &gt; Import & export &gt; Upload the file</b>. 
          </p>
        </li>
        <li>
          <p>
            Select your file and click <b>Import</b>.
          </p>
        </li>
      </ol>

      <h2> Why Use This Tool? </h2>
      <p>
        Fordham publishes final exam schedules in an Excel sheet that requires
        you to manually search through, find your courses, and jot down the
        times and locations of your exams. This process can be time-consuming
        and frustrating, but our website makes it easy. <br /><br />

        Our data includes both RH and LC undergaduate final exam schedules.
      </p>

      <br />
      <div className="d-grid gap-2">
        <Button onClick={navigateScheduler} variant="primary" size="lg">
          Create Your Schedule!
        </Button>
      </div>
      <br />
      <br />

      <h2> Made by Students, for Students </h2>
      <p>
        We understand how challenging finals week can be. That's why we built
        this tool to save you time and reduce stress. Hopefully, one day we can
        integrate this within Fordham's system so that your final exam schedules
        will be automatically created and sent to you.
      </p>
      <p>
        This website is not affiliated with or endorsed by Fordham University.
        It is an independent tool created to help students manage their exam
        schedules.
      </p>
      <p>
        This project is powered by React and Django, and deployed on{" "}
        <a href="https://www.render.com/" target="_blank">
          Render
        </a>
        .
        <br />
        You can check out the source code on{" "}
        <a
          href="https://github.com/ikalmikov16/Fordham-Final-Exam-Scheduler"
          target="_blank"
        >
          Github
        </a>
        .
      </p>
      <p>
        Best of luck on your exams, <br />
        Irakli Kalmikov & Atharva Shanbhag
        <br />
        <br />
        <br />
      </p>
    </div>
  );
};

export default HomePage;
