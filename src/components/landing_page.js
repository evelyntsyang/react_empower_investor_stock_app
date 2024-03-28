import React, { Component } from "react";
import { Outlet, Link } from "react-router-dom";
import { Container, Row, Col, Button } from 'react-bootstrap';

const LandingPage = () => {
  return (
    <diV>
      <div className="landing-page mt -2 ">
        <Container>
          <Row className="justify-content-center align-items-center">
            <Col md={6} className="text-center">
              <h1>Welcome to Finance App</h1>
              <p className="lead">
                Manage your finances easily with our powerful tools.
              </p>
              <Button variant="primary" size="lg" className="mt-3">
                Get Started
              </Button>
            </Col>
            <Col md={6} className="text-center">
              {/* Insert image or video component here */}
              <img
                src={require('../assets/finance_image.jpg')}
                alt="Finance App"
                className="img-fluid"
              />
            </Col>
          </Row>
        </Container>
      </div>
    </diV>
  );
};

export default LandingPage;
