import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import SchedulerPage from "./pages/SchedulerPage";

function App() {
  return (
    <>
      <NavBar />
      <Router>
        <Routes>
          <Route path="/" element={<SchedulerPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
