import { Card, Row, Col, Alert, Spinner } from "react-bootstrap";
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

      // Fetch data dari berbagai endpoint
      const [eventsRes, participantsRes, accountsRes] = await Promise.all([
        eventsAPI.getAll().catch(() => ({ data: [] })),
        participantsAPI.getAll().catch(() => ({ data: [] })),
        accountsAPI.getAll().catch(() => ({ data: [] })),
      ]);

      const events = eventsRes.data.data || [];
      const now = new Date();

      const ongoingEvents = events.data.filter((event) => {
        try {
          const start = new Date(event.start_time);
          const end = new Date(event.end_time);
          return now >= start && now <= end;
        } catch {
          return false;
        }
      }).length;

      const upcomingEvents = events.data.filter((event) => {
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
      <div className="text-center p-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2 text-muted">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <Alert variant="warning" className="mb-4">
          ⚠️ {error}
        </Alert>
      )}

      <Row className="g-4">
        {statCards.map((stat, index) => (
          <Col xl={2} lg={4} md={6} key={index}>
            <Card className={`border-0 shadow-sm bg-${stat.color} bg-opacity-10 h-100`}>
              <Card.Body className="d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                  <div className="me-3 fs-2">{stat.icon}</div>
                  <div className="flex-grow-1">
                    <Card.Title className="h6 text-muted mb-1">{stat.title}</Card.Title>
                    <Card.Text className="h3 fw-bold text-dark mb-0">{stat.value}</Card.Text>
                  </div>
                </div>
                <small className="text-muted mt-auto">{stat.description}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="border-0 shadow-sm mt-4">
        <Card.Header className="bg-white">
          <h5 className="mb-0">📊 Quick Actions</h5>
        </Card.Header>
        <Card.Body>
          <Row className="g-3">
            <Col md={3} sm={6}>
              <Card className="border-0 bg-light h-100">
                <Card.Body className="text-center">
                  <div className="fs-1 mb-2">📅</div>
                  <h6>Create Event</h6>
                  <small className="text-muted">Add new event</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="border-0 bg-light h-100">
                <Card.Body className="text-center">
                  <div className="fs-1 mb-2">👥</div>
                  <h6>Manage Participants</h6>
                  <small className="text-muted">View all participants</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="border-0 bg-light h-100">
                <Card.Body className="text-center">
                  <div className="fs-1 mb-2">📋</div>
                  <h6>Generate Reports</h6>
                  <small className="text-muted">Export data</small>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="border-0 bg-light h-100">
                <Card.Body className="text-center">
                  <div className="fs-1 mb-2">⚙️</div>
                  <h6>Settings</h6>
                  <small className="text-muted">System configuration</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default StatsCards;
