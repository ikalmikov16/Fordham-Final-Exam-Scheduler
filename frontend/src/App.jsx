import { useEffect, useState } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBar from "./components/SearchBar";
import Courses from "./components/Courses";
import Schedule from "./components/Schedule";

function App() {
  const [courses, setCourses] = useState([]);

  const addCourse = (course) => {
    setCourses((prevCourses) => [...prevCourses, course]);
  };

  useEffect(() => {
    console.log(courses);
  }, [courses]);

  return (
    <>
      <NavBar/>
      <br/>
      <br/>
      <div>
        <SearchBar addCourse={addCourse}/>
        <Courses courses={courses}/>
        {/* <Schedule courses={courses}/> */}
      </div>
    </>
  );
}

export default App;
