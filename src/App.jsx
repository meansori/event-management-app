import { useState, useEffect } from "react";
import { Container, Row, Col, Navbar, Nav, Button } from "react-bootstrap";
import Header from "./components/Layout/Header";
import Sidebar from "./components/Layout/Sidebar";
import StatsCards from "./components/Dashboard/StatsCards";
import EventList from "./components/Events/EventList";
import AccountList from "./components/Accounts/AccountList";
import ParticipantList from "./components/Participants/ParticipantList";
import LandingPage from "./components/Landing/LandingPage";
import StartupLanding from "./components/Landing/StartupLanding";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        logout();
      }
    }
    setIsLoading(false);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setActiveTab("dashboard");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setActiveTab("dashboard");
  };

  const navigateTo = (tab) => {
    setActiveTab(tab);
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show landing page if not authenticated
  if (!user) {
    return <LandingPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Show dashboard if authenticated
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <StatsCards />;
      case "events":
        return <EventList />;
      case "accounts":
        return <AccountList />;
      case "participants":
        return <ParticipantList />;
      default:
        return <StatsCards />;
    }
  };

  // Dashboard Header
  const DashboardHeader = () => (
    <Navbar bg="white" expand="lg" className="dashboard-header border-bottom">
      <Container fluid className="px-3">
        <Navbar.Brand href="#dashboard" className="fw-bold mb-0">
          🎯 Event Management Dashboard
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <div className="d-flex align-items-center">
              <span className="user-info me-3 text-muted">
                Welcome, <strong className="text-dark">{user.full_name}</strong>
              </span>
              <Button variant="outline-danger" size="sm" onClick={logout} className="logout-btn">
                🚪 Logout
              </Button>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

  return (
    <div className="dashboard-app">
      <DashboardHeader />

      <Container fluid className="dashboard-container">
        <Row className="g-0">
          {" "}
          {/* Remove gutters */}
          {/* Sidebar Column */}
          <Col xs={12} md={3} lg={2} className="sidebar-col">
            <Sidebar activeTab={activeTab} setActiveTab={navigateTo} />
          </Col>
          {/* Main Content Column */}
          <Col xs={12} md={9} lg={10} className="main-content-col">
            <div className="main-content">
              <div className="content-wrapper">{renderContent()}</div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
