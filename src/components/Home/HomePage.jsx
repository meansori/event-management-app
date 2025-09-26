import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Modal, Alert, Navbar, Nav } from "react-bootstrap";
import { eventsAPI, participantsAPI, accountsAPI, authAPI } from "../../services/api";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import "./HomePage.css";

const HomePage = ({ onNavigateToAdmin }) => {
  // const [events, setEvents] = useState([]);
  // const [stats, setStats] = useState({
  //   totalEvents: 0,
  //   totalParticipants: 0,
  //   totalAccounts: 0,
  //   ongoingEvents: 0,
  //   upcomingEvents: 0,
  // });
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  // const [selectedEvent, setSelectedEvent] = useState(null);
  // const [showEventModal, setShowEventModal] = useState(false);
  // const [searchTerm, setSearchTerm] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchData();
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        // Verify token is still valid
        verifyToken();
      } catch (error) {
        console.error("Error parsing user data:", error);
        logout();
      }
    }
  };

  const verifyToken = async () => {
    try {
      await authAPI.verifyToken();
    } catch (error) {
      console.error("Token verification failed:", error);
      logout();
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [eventsRes, participantsRes, accountsRes] = await Promise.all([
        eventsAPI.getAll().catch(() => ({ data: [] })),
        participantsAPI.getAll().catch(() => ({ data: [] })),
        accountsAPI.getAll().catch(() => ({ data: [] })),
      ]);

      const eventsData = eventsRes.data.data || [];
      setEvents(eventsData);

      const now = new Date();
      const ongoingEvents = eventsData.data.filter((event) => {
        try {
          const start = new Date(event.start_time);
          const end = new Date(event.end_time);
          return now >= start && now <= end;
        } catch {
          return false;
        }
      }).length;

      const upcomingEvents = eventsData.data.filter((event) => {
        try {
          const start = new Date(event.start_time);
          return now < start;
        } catch {
          return false;
        }
      }).length;

      setStats({
        totalEvents: eventsData.length,
        totalParticipants: participantsRes.data?.length || 0,
        totalAccounts: accountsRes.data?.length || 0,
        ongoingEvents: ongoingEvents,
        upcomingEvents: upcomingEvents,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data. Using sample data for demonstration.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLoginModal(false);
  };

  const handleRegister = (userData) => {
    setUser(userData);
    setShowRegisterModal(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    // Optional: Call logout API
    authAPI.logout().catch(console.error);
  };

  const handleAdminNavigation = () => {
    if (user) {
      onNavigateToAdmin();
    } else {
      setShowLoginModal(true);
    }
  };

  // const getEventStatus = (startTime, endTime) => {
  //   try {
  //     const now = new Date();
  //     const start = new Date(startTime);
  //     const end = new Date(endTime);

  //     if (now < start) return { type: "upcoming", label: "Upcoming", color: "warning" };
  //     if (now >= start && now <= end) return { type: "ongoing", label: "Ongoing", color: "success" };
  //     return { type: "completed", label: "Completed", color: "secondary" };
  //   } catch {
  //     return { type: "unknown", label: "Unknown", color: "secondary" };
  //   }
  // };

  // const formatDateTime = (dateTime) => {
  //   try {
  //     return new Date(dateTime).toLocaleString("id-ID", {
  //       weekday: "long",
  //       year: "numeric",
  //       month: "long",
  //       day: "numeric",
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     });
  //   } catch {
  //     return "Invalid Date";
  //   }
  // };

  // const filteredEvents = events.filter(
  //   (event) =>
  //     event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     event.location?.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // const openEventDetail = (event) => {
  //   setSelectedEvent(event);
  //   setShowModal(true);
  // };

  // const refreshData = () => {
  //   fetchData();
  // };

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      <Navbar bg="white" expand="lg" className="shadow-sm fixed-top home-navbar">
        <Container>
          <Navbar.Brand href="#home" className="fw-bold navbar-brand">
            🎯 Event Management System
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {user ? (
                <div className="d-flex align-items-center">
                  <span className="user-welcome me-3">Welcome, {user.full_name}</span>
                  <div className="d-flex gap-2">
                    <Button variant="outline-primary" size="sm" onClick={handleAdminNavigation}>
                      🛠️ Dashboard
                    </Button>
                    <Button variant="outline-secondary" size="sm" onClick={logout}>
                      🚪 Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" onClick={() => setShowLoginModal(true)}>
                    Sign In
                  </Button>
                  <Button variant="primary" onClick={() => setShowRegisterModal(true)}>
                    Sign Up
                  </Button>
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* Hero Section */}
      <section className="hero-section" style={{ paddingTop: "100px" }}>
        <Container>
          {/* <Row className="align-items-center min-vh-100">
            <Col lg={6}>
              <h1 className="hero-title">
                🎯 Event Management
                <span className="gradient-text"> System</span>
              </h1>
              <p className="hero-subtitle">
                Kelola dan pantau semua kegiatan Anda dalam satu platform yang modern dan efisien. Sistem manajemen
                event terintegrasi untuk kebutuhan organisasi Anda.
              </p>

              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">{stats.totalEvents}</span>
                  <span className="stat-label">Total Events</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{stats.ongoingEvents}</span>
                  <span className="stat-label">Ongoing Now</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{stats.totalParticipants}</span>
                  <span className="stat-label">Participants</span>
                </div>
              </div>

              <div className="hero-actions">
                <Button variant="primary" size="lg" onClick={handleAdminNavigation} className="me-3">
                  {user ? "🛠️ Go to Dashboard" : "🔐 Sign In to Dashboard"}
                </Button>
                <Button
                  variant="outline-primary"
                  size="lg"
                  onClick={() => document.getElementById("events-section").scrollIntoView({ behavior: "smooth" })}
                >
                  📅 View Events
                </Button>
                {!user && (
                  <Button variant="success" size="lg" onClick={() => setShowRegisterModal(true)} className="ms-3">
                    👤 Sign Up Free
                  </Button>
                )}
              </div>

              {!user && (
                <div className="mt-4">
                  <small className="text-muted">🔒 Sign up now to access full management features</small>
                </div>
              )}
            </Col>
            <Col lg={6}>
              <div className="hero-graphic">
                <div className="floating-card card-1">📅</div>
                <div className="floating-card card-2">👥</div>
                <div className="floating-card card-3">🎯</div>
                <div className="floating-card card-4">📊</div>
              </div>
            </Col>
          </Row> */}
        </Container>
      </section>

      {/* Stats Section */}
      {/* <section className="stats-section">
        <Container>
          <Row className="g-4">
            <Col md={3} sm={6}>
              <div className="stat-card">
                <div className="stat-icon">📅</div>
                <div className="stat-content">
                  <h3>{stats.totalEvents}</h3>
                  <p>Total Events</p>
                </div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <div className="stat-icon">🟢</div>
                <div className="stat-content">
                  <h3>{stats.ongoingEvents}</h3>
                  <p>Ongoing Events</p>
                </div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h3>{stats.totalParticipants}</h3>
                  <p>Participants</p>
                </div>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="stat-card">
                <div className="stat-icon">👤</div>
                <div className="stat-content">
                  <h3>{stats.totalAccounts}</h3>
                  <p>Accounts</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section> */}

      {/* Events Section */}
      <section id="events-section" className="events-section">
        <Container>
          {/* <Row className="mb-5">
            <Col>
              <div className="section-header">
                <h2 className="section-title">📅 All Events</h2>
                <p className="section-subtitle">
                  Temukan dan kelola semua kegiatan yang sedang berlangsung dan akan datang
                </p>

                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                  <div className="search-container">
                    <div className="search-box">
                      <span className="search-icon">🔍</span>
                      <input
                        type="text"
                        placeholder="Cari event berdasarkan judul, deskripsi, atau lokasi..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                      />
                    </div>
                  </div>

                  <div className="section-actions">
                    <Button variant="outline-primary" size="sm" onClick={refreshData}>
                      🔄 Refresh
                    </Button>
                    <Button variant="primary" size="sm" onClick={onNavigateToAdmin}>
                      ➕ Manage Events
                    </Button>
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="warning" className="mt-3">
                  ⚠️ {error}
                </Alert>
              )}
            </Col>
          </Row> */}

          {/* Events Grid */}
          {/* <Row className="g-4">
            {filteredEvents.length === 0 ? (
              <Col>
                <div className="no-events">
                  <div className="no-events-icon">📅</div>
                  <h3>No Events Found</h3>
                  <p>Try adjusting your search terms or create a new event</p>
                  <Button variant="primary" onClick={onNavigateToAdmin}>
                    Create New Event
                  </Button>
                </div>
              </Col>
            ) : (
              filteredEvents.map((event) => {
                const status = getEventStatus(event.start_time, event.end_time);
                const eventDuration = Math.ceil(
                  (new Date(event.end_time) - new Date(event.start_time)) / (1000 * 60 * 60)
                );

                return (
                  <Col key={event.id} lg={4} md={6}>
                    <Card className="event-card h-100">
                      <Card.Body>
                        <div className="event-header">
                          <Badge bg={status.color} className="status-badge">
                            {status.label}
                          </Badge>
                          <div className="event-date">
                            {new Date(event.start_time).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                            })}
                          </div>
                        </div>

                        <h5 className="event-title">{event.title || "Untitled Event"}</h5>
                        <p className="event-description">{event.description || "No description available."}</p>

                        <div className="event-details">
                          <div className="detail-item">
                            <span className="detail-icon">📍</span>
                            <span className="detail-text">{event.location || "Location not specified"}</span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-icon">⏰</span>
                            <span className="detail-text">
                              {new Date(event.start_time).toLocaleTimeString("id-ID", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="detail-item">
                            <span className="detail-icon">⏱️</span>
                            <span className="detail-text">{eventDuration}h duration</span>
                          </div>
                        </div>
                      </Card.Body>

                      <Card.Footer className="event-footer">
                        <Button variant="outline-primary" size="sm" onClick={() => openEventDetail(event)}>
                          View Details
                        </Button>
                        <small className="text-muted">Created by: {event.created_by || "System"}</small>
                      </Card.Footer>
                    </Card>
                  </Col>
                );
              })
            )}
          </Row> */}
        </Container>
      </section>

      {/* Event Detail Modal */}
      {/* <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Event Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div className="event-detail">
              <div className="detail-header">
                <Badge bg={getEventStatus(selectedEvent.start_time, selectedEvent.end_time).color}>
                  {getEventStatus(selectedEvent.start_time, selectedEvent.end_time).label}
                </Badge>
                <h3>{selectedEvent.title}</h3>
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <strong>📍 Location</strong>
                  <p>{selectedEvent.location || "Location not specified"}</p>
                </div>
                <div className="detail-item">
                  <strong>⏰ Start Time</strong>
                  <p>{formatDateTime(selectedEvent.start_time)}</p>
                </div>
                <div className="detail-item">
                  <strong>⏱️ End Time</strong>
                  <p>{formatDateTime(selectedEvent.end_time)}</p>
                </div>
                <div className="detail-item">
                  <strong>📝 Description</strong>
                  <p>{selectedEvent.description || "No description available."}</p>
                </div>
                <div className="detail-item">
                  <strong>👤 Created By</strong>
                  <p>User #{selectedEvent.created_by || "System"}</p>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={onNavigateToAdmin}>
            Manage Events
          </Button>
        </Modal.Footer>
      </Modal> */}

      {/* Footer */}
      <footer className="home-footer">
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
        onLoginSuccess={handleRegister}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </div>
  );
};

export default HomePage;
