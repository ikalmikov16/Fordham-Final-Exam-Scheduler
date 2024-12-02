import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import SchedulerPage from "./pages/SchedulerPage";
import HomePage from "./pages/HomePage";
import ReactGA from "react-ga4";
import { useEffect } from "react";

// ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS_ID);

function App() {
  return (
    <>
      <Router>
        {/* <PageTracker /> */}
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/schedule" element={<SchedulerPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        </Routes>
      </Router>
    </>
  );
}

// function PageTracker() {
//   const location = useLocation();

//   useEffect(() => {
//     ReactGA.send({ hitType: "pageview", page: location.pathname });
//   }, [location]);

//   return null;
// }

export default App;
