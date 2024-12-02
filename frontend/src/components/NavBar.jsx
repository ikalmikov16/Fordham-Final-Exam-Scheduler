import React from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import "../styles/NavBar.css";
import logo from "../assets/logo.png";

const NavBar = () => {
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate("/");
  };
  const navigateScheduler = () => {
    navigate("/schedule");
  };

  return (
    <Navbar data-bs-theme="dark" className="navbar">
      <Container>
        <Navbar.Brand>
          <Nav.Link onClick={navigateHome}>Fordham Final Exams</Nav.Link>
        </Navbar.Brand>
        <Nav className="me-auto">
          <Nav.Link onClick={navigateHome}>Home</Nav.Link>
          <Nav.Link onClick={navigateScheduler}>Scheduler</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
