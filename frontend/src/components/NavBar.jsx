import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import "../styles/NavBar.css";
import logo from "../assets/logo.png";

const NavBar = () => {
  return (
    <Navbar data-bs-theme="dark" className="navbar">
      <Container>
        <Navbar.Brand href="#home">
          <img
            src={logo}
            alt="Fordham Logo"
            // width="400"
            height="35"
            className="d-inline-block align-top logo-white"
          />{" "}
          {/* Fordham Final Exam Scheduler */}
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default NavBar;
