import { useState } from "react";
import { Container, Row, Col, Button, Card, Modal } from "react-bootstrap";
import LoginModal from "../Home/LoginModal";
import RegisterModal from "../Home/RegisterModal";
import "./LandingPage.css";

const LandingPage = ({ onLoginSuccess }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const features = [
    {
      icon: "📅",
      title: "Event Management",
      description: "Kelola event dengan mudah dan efisien",
    },
    {
      icon: "👥",
      title: "Participant Tracking",
      description: "Pantau kehadiran peserta secara real-time",
    },
    {
      icon: "📊",
      title: "Analytics Dashboard",
      description: "Lihat insights dan laporan lengkap",
    },
    {
      icon: "🔐",
      title: "Secure Platform",
      description: "Data Anda aman dan terproteksi",
    },
  ];

  const handleLogin = (userData) => {
    onLoginSuccess(userData);
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6}>
              <div className="hero-content">
                <h1 className="hero-title">
                  Event Management
                  <span className="gradient-text"> Made Simple</span>
                </h1>
                <p className="hero-subtitle">Platform modern untuk mengelola event, peserta, dan kehadiran dengan antarmuka yang intuitif dan powerful.</p>
                <div className="hero-actions">
                  <Button variant="primary" size="lg" onClick={() => setShowLoginModal(true)} className="hero-btn-primary">
                    🚀 Get Started
                  </Button>
                  <Button variant="outline-light" size="lg" onClick={() => document.getElementById("features").scrollIntoView({ behavior: "smooth" })} className="hero-btn-secondary">
                    📋 Learn More
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-visual">
                <div className="floating-element element-1">🎯</div>
                <div className="floating-element element-2">📅</div>
                <div className="floating-element element-3">👥</div>
                <div className="floating-element element-4">📊</div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title">Why Choose Our Platform?</h2>
              <p className="section-subtitle">Everything you need to manage your events efficiently</p>
            </Col>
          </Row>
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col lg={3} md={6} key={index}>
                <Card className="feature-card">
                  <Card.Body className="text-center">
                    <div className="feature-icon">{feature.icon}</div>
                    <h5 className="feature-title">{feature.title}</h5>
                    <p className="feature-description">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="cta-title">Ready to Transform Your Event Management?</h2>
              <p className="cta-subtitle">Join thousands of organizers who trust our platform for their event management needs.</p>
              {/* <div className="cta-actions">
                <Button variant="primary" size="lg" onClick={() => setShowRegisterModal(true)} className="cta-btn-primary">
                  👤 Sign Up Free
                </Button>
                <Button variant="outline-primary" size="lg" onClick={() => setShowLoginModal(true)} className="cta-btn-secondary">
                  🔐 Sign In
                </Button>
              </div> */}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <Container>
          <Row>
            <Col>
              <p className="text-center text-muted">© 2024 Event Management System. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>

      {/* Auth Modals */}
      <LoginModal
        show={showLoginModal}
        onHide={() => setShowLoginModal(false)}
        onLoginSuccess={handleLogin}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />

      <RegisterModal
        show={showRegisterModal}
        onHide={() => setShowRegisterModal(false)}
        onLoginSuccess={handleLogin}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </div>
  );
};

export default LandingPage;
