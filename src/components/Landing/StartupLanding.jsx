import { useState, useRef } from "react";
import { Container, Row, Col, Button, Card, Modal } from "react-bootstrap";
import LoginModal from "../Home/LoginModal";
import RegisterModal from "../Home/RegisterModal";
import "./StartupLanding.css";

const StartupLanding = ({ onLoginSuccess }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const featuresRef = useRef(null);
  const pricingRef = useRef(null);

  const features = [
    {
      icon: "🚀",
      title: "Lightning Fast",
      description: "Manage events in real-time with our optimized platform",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      icon: "🎯",
      title: "Smart Analytics",
      description: "Get insights with beautiful dashboards and reports",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    },
    {
      icon: "🔒",
      title: "Enterprise Security",
      description: "Bank-level security for your sensitive data",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    },
    {
      icon: "📱",
      title: "Mobile First",
      description: "Perfect experience on any device, anywhere",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    },
    {
      icon: "🔄",
      title: "Automated Workflows",
      description: "Streamline your event management processes",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    },
    {
      icon: "🌐",
      title: "Global Scale",
      description: "Handle events of any size, from local to international",
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Event Manager at TechConf",
      content: "This platform revolutionized how we manage our 10,000+ attendee conferences. Simply amazing!",
      avatar: "👩‍💼",
    },
    {
      name: "Mike Rodriguez",
      role: "Marketing Director",
      content: "The analytics dashboard helped us increase event attendance by 45% in just 3 months.",
      avatar: "👨‍💼",
    },
    {
      name: "Emily Watson",
      role: "Startup Founder",
      content: "As a small team, this tool gave us enterprise-level capabilities without the complexity.",
      avatar: "👩‍🎓",
    },
  ];

  const stats = [
    { number: "50K+", label: "Events Managed" },
    { number: "2M+", label: "Participants" },
    { number: "98%", label: "Customer Satisfaction" },
    { number: "24/7", label: "Support Available" },
  ];

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogin = (userData) => {
    onLoginSuccess(userData);
  };

  return (
    <div className="startup-landing">
      {/* Navigation */}
      <nav className="startup-nav">
        <Container>
          <div className="nav-content">
            <div className="nav-brand">
              <span className="brand-icon">🎯</span>
              <span className="brand-text">EventFlow</span>
            </div>
            <div className="nav-links">
              <button onClick={() => scrollToSection(featuresRef)}>Features</button>
              <button onClick={() => scrollToSection(pricingRef)}>Pricing</button>
              <button onClick={() => setShowLoginModal(true)}>Sign In</button>
              <Button variant="primary" className="nav-cta" onClick={() => setShowRegisterModal(true)}>
                Get Started Free
              </Button>
            </div>
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="gradient-overlay"></div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        <Container>
          <Row className="align-items-center min-vh-100">
            <Col lg={6}>
              <div className="hero-content">
                <div className="badge-container">
                  <span className="feature-badge">🚀 New AI Features Available</span>
                </div>
                <h1 className="hero-title">
                  Event Management
                  <span className="gradient-text"> Reimagined</span>
                </h1>
                <p className="hero-subtitle">The all-in-one platform to plan, promote, and perfect your events. Join thousands of organizers who trust EventFlow for seamless event management.</p>
                <div className="hero-stats">
                  {stats.map((stat, index) => (
                    <div key={index} className="stat-item">
                      <div className="stat-number">{stat.number}</div>
                      <div className="stat-label">{stat.label}</div>
                    </div>
                  ))}
                </div>
                <div className="hero-actions">
                  <Button variant="primary" size="lg" className="cta-primary" onClick={() => setShowRegisterModal(true)}>
                    Start Free Trial
                  </Button>
                  <Button variant="outline-light" size="lg" className="cta-secondary" onClick={() => scrollToSection(featuresRef)}>
                    Watch Demo
                  </Button>
                </div>
                <div className="trusted-by">
                  <span>Trusted by industry leaders:</span>
                  <div className="company-logos">
                    <span>Google</span>
                    <span>Microsoft</span>
                    <span>Amazon</span>
                    <span>Netflix</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-visual">
                <div className="dashboard-preview">
                  <div className="preview-header">
                    <div className="window-controls">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                  <div className="preview-content">
                    <div className="metric-card"></div>
                    <div className="chart-card"></div>
                    <div className="activity-card"></div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="features-section">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h2 className="section-title">Everything You Need to Succeed</h2>
              <p className="section-subtitle">Powerful features designed to make event management effortless and enjoyable</p>
            </Col>
          </Row>
          <Row className="g-4">
            {features.map((feature, index) => (
              <Col lg={4} md={6} key={index}>
                <Card className="feature-card">
                  <Card.Body>
                    <div className="feature-icon-container" style={{ background: feature.gradient }}>
                      <span className="feature-icon">{feature.icon}</span>
                    </div>
                    <h4 className="feature-title">{feature.title}</h4>
                    <p className="feature-description">{feature.description}</p>
                    <button className="feature-link">Learn more →</button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h2 className="section-title">Loved by Event Professionals</h2>
              <p className="section-subtitle">See what our customers say about their experience with EventFlow</p>
            </Col>
          </Row>
          <Row className="g-4">
            {testimonials.map((testimonial, index) => (
              <Col lg={4} key={index}>
                <Card className="testimonial-card">
                  <Card.Body>
                    <div className="testimonial-content">"{testimonial.content}"</div>
                    <div className="testimonial-author">
                      <div className="author-avatar">{testimonial.avatar}</div>
                      <div className="author-info">
                        <div className="author-name">{testimonial.name}</div>
                        <div className="author-role">{testimonial.role}</div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section ref={pricingRef} className="cta-section">
        <Container>
          <Row className="text-center">
            <Col lg={8} className="mx-auto">
              <h2 className="cta-title">Ready to Transform Your Events?</h2>
              <p className="cta-subtitle">Join thousands of event professionals who trust EventFlow for their most important events</p>
              <div className="cta-actions">
                <Button variant="primary" size="lg" className="cta-btn-primary" onClick={() => setShowRegisterModal(true)}>
                  Start Free Trial
                </Button>
                <Button variant="outline-light" size="lg" className="cta-btn-secondary" onClick={() => setShowLoginModal(true)}>
                  Schedule a Demo
                </Button>
              </div>
              <div className="cta-features">
                <span>✓ 14-day free trial</span>
                <span>✓ No credit card required</span>
                <span>✓ Cancel anytime</span>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="startup-footer">
        <Container>
          <Row>
            <Col lg={4}>
              <div className="footer-brand">
                <span className="brand-icon">🎯</span>
                <span className="brand-text">EventFlow</span>
              </div>
              <p className="footer-description">The modern event management platform for teams that want to create unforgettable experiences.</p>
            </Col>
            <Col lg={8}>
              <Row>
                <Col md={4}>
                  <h6>Product</h6>
                  <ul>
                    <li>
                      <a href="#features">Features</a>
                    </li>
                    <li>
                      <a href="#pricing">Pricing</a>
                    </li>
                    <li>
                      <a href="#integrations">Integrations</a>
                    </li>
                    <li>
                      <a href="#updates">Updates</a>
                    </li>
                  </ul>
                </Col>
                <Col md={4}>
                  <h6>Resources</h6>
                  <ul>
                    <li>
                      <a href="#blog">Blog</a>
                    </li>
                    <li>
                      <a href="#docs">Documentation</a>
                    </li>
                    <li>
                      <a href="#support">Support</a>
                    </li>
                    <li>
                      <a href="#community">Community</a>
                    </li>
                  </ul>
                </Col>
                <Col md={4}>
                  <h6>Company</h6>
                  <ul>
                    <li>
                      <a href="#about">About</a>
                    </li>
                    <li>
                      <a href="#careers">Careers</a>
                    </li>
                    <li>
                      <a href="#contact">Contact</a>
                    </li>
                    <li>
                      <a href="#privacy">Privacy</a>
                    </li>
                  </ul>
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="footer-bottom">
            <p>© 2024 EventFlow. All rights reserved.</p>
          </div>
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

export default StartupLanding;
