import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Badge, Modal, Alert, Navbar, Nav } from "react-bootstrap";
import { eventsAPI, participantsAPI, accountsAPI, authAPI } from "../../services/api";
import LoginModal from "./LoginModal";
import axios from "axios";
import RegisterModal from "./RegisterModal";
import "./HomePage.css";

const HomePage = ({ onNavigateToAdmin }) => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    totalAccounts: 0,
    ongoingEvents: 0,
    upcomingEvents: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  // const checkAuthStatus = () => {
  //   const token = localStorage.getItem("token");
  //   const userData = localStorage.getItem("user");

  //   if (token && userData) {
  //     try {
  //       setUser(JSON.parse(userData));
  //       // Verify token is still valid
  //       verifyToken();
  //     } catch (error) {
  //       console.error("Error parsing user data:", error);
  //       logout();
  //     }
  //   }
  // };

  const checkAuthStatus = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/auth/verify", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUser(res.data.data.user);
      console.log("✅ User verified:", res.data.data.user);
    } catch (err) {
      console.error("❌ Token verification failed:", err);
      localStorage.removeItem("token");
    }
  };

  // const verifyToken = async () => {
  //   try {
  //     await authAPI.verifyToken();
  //   } catch (error) {
  //     console.error("Token verification failed:", error);
  //     logout();
  //   }
  // };

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
