import { Card, Row, Col, Alert, Spinner, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { dashboardAPI, eventsAPI, participantsAPI, accountsAPI } from "../../services/api";

const StatsCards = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    ongoingEvents: 0,
    upcomingEvents: 0,
    totalParticipants: 0,
    totalAccounts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const [eventsRes, participantsRes, accountsRes] = await Promise.all([
        eventsAPI.getAll().catch(() => ({ data: [] })),
        participantsAPI.getAll().catch(() => ({ data: [] })),
        accountsAPI.getAll().catch(() => ({ data: [] })),
      ]);

      const events = eventsRes.data.data.data || [];
      const now = new Date();

      const ongoingEvents = events.filter((event) => {
        try {
          const start = new Date(event.start_time);
          const end = new Date(event.end_time);
          return now >= start && now <= end;
        } catch {
          return false;
        }
      }).length;

      const upcomingEvents = events.filter((event) => {
        try {
          const start = new Date(event.start_time);
          return now < start;
        } catch {
          return false;
        }
      }).length;

      setStats({
        totalEvents: events.length,
        ongoingEvents: ongoingEvents,
        upcomingEvents: upcomingEvents,
        totalParticipants: participantsRes.data?.length || 0,
        totalAccounts: accountsRes.data?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Failed to load dashboard data. Showing sample data.");
      setStats({
        totalEvents: 15,
        ongoingEvents: 3,
        upcomingEvents: 5,
        totalParticipants: 120,
        totalAccounts: 8,
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Events",
      value: stats.totalEvents,
      color: "primary",
      icon: "📅",
      description: "All created events",
    },
    {
      title: "Ongoing Events",
      value: stats.ongoingEvents,
      color: "success",
      icon: "🟢",
      description: "Events happening now",
    },
    {
      title: "Upcoming Events",
      value: stats.upcomingEvents,
      color: "warning",
      icon: "⏳",
      description: "Future events",
    },
    {
      title: "Total Participants",
      value: stats.totalParticipants,
      color: "info",
      icon: "👥",
      description: "Registered participants",
    },
    {
      title: "System Accounts",
      value: stats.totalAccounts,
      color: "secondary",
      icon: "👤",
      description: "User accounts",
    },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary" size="lg">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2 text-muted">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="full-width-content">
      {/* Page Header */}
      <div className="dashboard-page-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4 className="mb-1 fw-bold">Dashboard Overview</h4>
            <p className="text-muted mb-0">Welcome to your event management dashboard</p>
          </div>
          <Button variant="outline-primary" size="sm" onClick={fetchStats}>
            🔄 Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="warning" className="mb-4">
          ⚠️ {error}
        </Alert>
      )}

      {/* Stats Cards - FULL WIDTH */}
      <Row className="g-3 mb-4">
        {statCards.map((stat, index) => (
          <Col xl={2} lg={4} md={6} sm={6} key={index}>
            <Card className="stat-card h-100 border-0 shadow-sm">
              <Card.Body className="p-3">
                <div className="d-flex align-items-center">
                  <div className="stat-icon-wrapper me-3">
                    <span className="stat-icon">{stat.icon}</span>
                  </div>
                  <div className="flex-grow-1">
                    <div className="stat-value h4 fw-bold text-dark mb-1">{stat.value}</div>
                    <div className="stat-title text-muted small">{stat.title}</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Actions - FULL WIDTH */}
      <Card className="full-width-card border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-3">
          <h5 className="mb-0 fw-semibold">📊 Quick Actions</h5>
        </Card.Header>
        <Card.Body className="p-0">
          <Row className="g-0">
            <Col md={3} sm={6}>
              <div className="quick-action-item p-4 text-center border-end">
                <div className="action-icon fs-1 mb-3">📅</div>
                <h6 className="fw-semibold">Create Event</h6>
                <p className="text-muted small mb-3">Add new event to the system</p>
                <Button variant="outline-primary" size="sm">
                  Get Started
                </Button>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="quick-action-item p-4 text-center border-end">
                <div className="action-icon fs-1 mb-3">👥</div>
                <h6 className="fw-semibold">Manage Participants</h6>
                <p className="text-muted small mb-3">View and manage all participants</p>
                <Button variant="outline-success" size="sm">
                  View Participants
                </Button>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="quick-action-item p-4 text-center border-end">
                <div className="action-icon fs-1 mb-3">📋</div>
                <h6 className="fw-semibold">Generate Reports</h6>
                <p className="text-muted small mb-3">Export data and analytics</p>
                <Button variant="outline-info" size="sm">
                  Generate Report
                </Button>
              </div>
            </Col>
            <Col md={3} sm={6}>
              <div className="quick-action-item p-4 text-center">
                <div className="action-icon fs-1 mb-3">⚙️</div>
                <h6 className="fw-semibold">System Settings</h6>
                <p className="text-muted small mb-3">Configure system preferences</p>
                <Button variant="outline-secondary" size="sm">
                  Open Settings
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Recent Activity - FULL WIDTH */}
      <Row className="mt-4 g-4">
        <Col lg={8}>
          <Card className="full-width-card border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0 fw-semibold">📈 Recent Activity</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center py-5 text-muted">
                <div className="fs-1 mb-3">📊</div>
                <p>Activity chart will be displayed here</p>
                <small>Recent events and participant activities</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="full-width-card border-0 shadow-sm h-100">
            <Card.Header className="bg-white border-0 py-3">
              <h5 className="mb-0 fw-semibold">🔄 Quick Stats</h5>
            </Card.Header>
            <Card.Body>
              <div className="quick-stats">
                <div className="stat-item d-flex justify-content-between align-items-center py-2 border-bottom">
                  <span>Events Today</span>
                  <strong className="text-primary">2</strong>
                </div>
                <div className="stat-item d-flex justify-content-between align-items-center py-2 border-bottom">
                  <span>New Participants</span>
                  <strong className="text-success">15</strong>
                </div>
                <div className="stat-item d-flex justify-content-between align-items-center py-2 border-bottom">
                  <span>Pending Approvals</span>
                  <strong className="text-warning">3</strong>
                </div>
                <div className="stat-item d-flex justify-content-between align-items-center py-2">
                  <span>System Health</span>
                  <strong className="text-success">Excellent</strong>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatsCards;
