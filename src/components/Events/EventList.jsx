import { useState, useEffect } from "react";
import { Table, Button, Card, Alert, Spinner, Badge, Form, Row, Col } from "react-bootstrap";
import { eventsAPI } from "../../services/api";
import EventForm from "./EventForm";

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
      console.log("📅 Events API Response:", response.data);
      setEvents(response.data || []);
    } catch (error) {
      console.error("❌ Error fetching events:", error);
      setError("Failed to load events. Using sample data for demonstration.");
      setEvents([
        {
          id: 1,
          title: "Pengajian Remaja",
          description: "Usia SMP",
          location: "Masjid Nurul Hakim Lt 1",
          start_time: "2024-12-28T08:00:00",
          end_time: "2024-12-28T12:00:00",
          created_by: 1,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
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
      <div className="text-center p-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading events...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h5 className="mb-0">Events Management</h5>
            <small className="text-muted">Total: {filteredEvents.length} events</small>
          </div>
          <Button variant="primary" onClick={() => setShowForm(true)}>
            + Add Event
          </Button>
        </Card.Header>
        <Card.Body>
          {/* Filters */}
          <Row className="g-3 mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Search Events</Form.Label>
                <Form.Control type="text" placeholder="Search by title, description, or location..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Status Filter</Form.Label>
                <Form.Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
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
                  <Button variant="outline-secondary" size="sm" onClick={fetchEvents}>
                    🔄 Refresh
                  </Button>
                </div>
              </Form.Group>
            </Col>
          </Row>

          {error && (
            <Alert variant="warning" className="mb-3">
              ⚠️ {error}
            </Alert>
          )}

          {filteredEvents.length === 0 ? (
            <div className="text-center p-5 text-muted">
              <p>No events found. {searchTerm || statusFilter !== "all" ? "Try adjusting your filters." : "Create your first event!"}</p>
              {!searchTerm && statusFilter === "all" && (
                <Button variant="primary" onClick={() => setShowForm(true)}>
                  Create First Event
                </Button>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Location</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents.data.map((event) => {
                    const status = getEventStatus(event.start_time, event.end_time);
                    return (
                      <tr key={event.id}>
                        <td className="fw-semibold">{event.title || "Untitled"}</td>
                        <td>
                          <div className="text-truncate" style={{ maxWidth: "200px" }}>
                            {event.description || "No description"}
                          </div>
                        </td>
                        <td>{event.location || "Not specified"}</td>
                        <td>{event.start_time ? new Date(event.start_time).toLocaleString() : "Invalid date"}</td>
                        <td>{event.end_time ? new Date(event.end_time).toLocaleString() : "Invalid date"}</td>
                        <td>
                          <Badge bg={status.color}>{status.label}</Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => {
                                setEditingEvent(event);
                                setShowForm(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDelete(event.id)}>
                              Delete
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
