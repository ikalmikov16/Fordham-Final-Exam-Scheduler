import React from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import "../styles/NavBar.css";
import logo from "../assets/logo.png";

const NavBar = () => {
  return (
    <Navbar data-bs-theme="dark" className="navbar">
      <Container>
        <Navbar.Brand>Fordham Final Exams</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default NavBar;
