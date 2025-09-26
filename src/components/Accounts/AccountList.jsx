import { useState, useEffect } from "react";
import { Table, Button, Card, Alert, Spinner, Badge, Form, Row, Col } from "react-bootstrap";
import { eventsAPI } from "../../services/api";
import EventForm from "../Events/EventForm";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchEvents();
  }, [refreshTrigger]);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, statusFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsAPI.getAll();
      setEvents(response.data || []);
    } catch (error) {
      console.error("❌ Error fetching events:", error);
      setError("Failed to load events. Using sample data for demonstration.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      const now = new Date();
      filtered = filtered.filter((event) => {
        try {
          const start = new Date(event.start_time);
          const end = new Date(event.end_time);

          switch (statusFilter) {
            case "ongoing":
              return now >= start && now <= end;
            case "upcoming":
              return now < start;
            case "completed":
              return now > end;
            default:
              return true;
          }
        } catch {
          return false;
        }
      });
    }

    setFilteredEvents(filtered);
  };

  const getEventStatus = (startTime, endTime) => {
    try {
      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (now < start) return { label: "Upcoming", color: "warning" };
      if (now >= start && now <= end) return { label: "Ongoing", color: "success" };
      return { label: "Completed", color: "secondary" };
    } catch {
      return { label: "Unknown", color: "secondary" };
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await eventsAPI.delete(id);
        setRefreshTrigger((prev) => prev + 1);
      } catch (error) {
        console.error("❌ Error deleting event:", error);
        alert("Failed to delete event. Please try again.");
      }
    }
  };

  const handleSaveSuccess = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading events...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="full-width-content">
      {/* Page Header */}
      <div className="dashboard-page-header mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h4 className="mb-1 fw-bold">Events Management</h4>
            <p className="text-muted mb-0">Manage all events in the system</p>
          </div>
          <Button variant="primary" onClick={() => setShowForm(true)}>
            + Add Event
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="full-width-card border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Search Events</Form.Label>
                <Form.Control type="text" placeholder="Search by title, description, or location..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="full-width-input" />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Status Filter</Form.Label>
                <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="full-width-input">
                  <option value="all">All Status</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Actions</Form.Label>
                <div>
                  <Button variant="outline-secondary" size="sm" onClick={fetchEvents} className="w-100">
                    🔄 Refresh
                  </Button>
                </div>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && (
        <Alert variant="warning" className="mb-4">
          ⚠️ {error}
        </Alert>
      )}

      {/* Events Table */}
      <Card className="full-width-card border-0 shadow-sm">
        <Card.Header className="bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-semibold">All Events</h5>
            <span className="text-muted">
              Showing {filteredEvents.length} of {events.length} events
            </span>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <div className="fs-1 mb-3">📅</div>
              <h5>No Events Found</h5>
              <p>Try adjusting your filters or create a new event</p>
              {!searchTerm && statusFilter === "all" && (
                <Button variant="primary" onClick={() => setShowForm(true)}>
                  Create First Event
                </Button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="mb-0 full-width-table">
                <thead className="table-light">
                  <tr>
                    <th width="25%">Title</th>
                    <th width="30%">Description</th>
                    <th width="15%">Location</th>
                    <th width="15%">Start Time</th>
                    <th width="10%">Status</th>
                    <th width="5%">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.map((event) => {
                    const status = getEventStatus(event.start_time, event.end_time);
                    return (
                      <tr key={event.id}>
                        <td className="fw-semibold">{event.title || "Untitled"}</td>
                        <td>
                          <div className="text-truncate" style={{ maxWidth: "300px" }}>
                            {event.description || "No description"}
                          </div>
                        </td>
                        <td>{event.location || "Not specified"}</td>
                        <td>{event.start_time ? new Date(event.start_time).toLocaleDateString() : "Invalid date"}</td>
                        <td>
                          <Badge bg={status.color}>{status.label}</Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => {
                                setEditingEvent(event);
                                setShowForm(true);
                              }}
                              title="Edit event"
                            >
                              ✏️
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(event.id)} title="Delete event">
                              🗑️
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      <EventForm
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setEditingEvent(null);
        }}
        event={editingEvent}
        onSave={handleSaveSuccess}
      />
    </div>
  );
};

export default EventList;
