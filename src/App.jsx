import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Navbar, Nav } from "react-bootstrap";
import Header from "./components/Layout/Header";
import Sidebar from "./components/Layout/Sidebar";
import StatsCards from "./components/Dashboard/StatsCards";
import EventList from "./components/Events/EventList";
import AccountList from "./components/Accounts/AccountList";
import ParticipantList from "./components/Participants/ParticipantList";
import HomePage from "./components/Home/HomePage";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Handle navigation from URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash && ["dashboard", "events", "accounts", "participants", "home", "admin"].includes(hash)) {
        setActiveTab(hash === "admin" ? "dashboard" : hash);
        setShowAdminPanel(hash === "admin" || hash !== "home");
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (tab) => {
    setActiveTab(tab);
    window.location.hash = tab;
    if (tab !== "home") {
      setShowAdminPanel(true);
    }
  };

  const navigateToHome = () => {
    setActiveTab("home");
    setShowAdminPanel(false);
    window.location.hash = "home";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomePage onNavigateToAdmin={() => navigateTo("dashboard")} />;
      case "dashboard":
        return <StatsCards />;
      case "events":
        return <EventList />;
      case "accounts":
        return <AccountList />;
      case "participants":
        return <ParticipantList />;
      default:
        return <HomePage onNavigateToAdmin={() => navigateTo("dashboard")} />;
    }
  };

  // Simple Header untuk Admin Panel
  const AdminHeader = () => (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container fluid>
        <Navbar.Brand href="#home" onClick={navigateToHome} className="fw-bold cursor-pointer">
          🎯 Event Management System
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#home" onClick={navigateToHome}>
              🏠 Home
            </Nav.Link>
            <Nav.Link href="#dashboard" onClick={() => navigateTo("dashboard")}>
              📊 Dashboard
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );

  if (!showAdminPanel) {
    return <HomePage onNavigateToAdmin={() => navigateTo("dashboard")} />;
  }

  return (
    <div className="min-vh-100 bg-light">
      <AdminHeader />
      <Container fluid>
        <Row>
          <Col xs={12} md={3} lg={2} className="p-0">
            <Sidebar activeTab={activeTab} setActiveTab={navigateTo} />
          </Col>
          <Col xs={12} md={9} lg={10} className="p-4">
            <div className="mb-4">
              {/* <Button variant="outline-primary" size="sm" onClick={navigateToHome} className="mb-3">
                ← Back to Home
              </Button> */}
              <h4 className="text-capitalize">{activeTab} Management</h4>
            </div>
            {renderContent()}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
