import { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { participantsAPI } from "../../services/api";

const ParticipantForm = ({ show, onHide, participant, onSave }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    address: "",
    category_id: 2,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (participant) {
      setFormData({
        full_name: participant.full_name || "",
        address: participant.address || "",
        category_id: participant.category_id || 2,
      });
    } else {
      setFormData({
        full_name: "",
        address: "",
        category_id: 2,
      });
    }
    setError("");
  }, [participant, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (participant) {
        await participantsAPI.update(participant.id, formData);
      } else {
        await participantsAPI.create(formData);
      }
      onSave();
      onHide();
    } catch (error) {
      console.error("Error saving participant:", error);
      setError("Failed to save participant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{participant ? "Edit Participant" : "Add New Participant"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Full Name *</Form.Label>
            <Form.Control type="text" value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} required disabled={loading} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address *</Form.Label>
            <Form.Control as="textarea" rows={2} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required disabled={loading} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category ID</Form.Label>
            <Form.Select value={formData.category_id} onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })} disabled={loading}>
              <option value={1}>Category 1</option>
              <option value={2}>Category 2</option>
              <option value={3}>Category 3</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                {participant ? "Updating..." : "Creating..."}
              </>
            ) : participant ? (
              "Update Participant"
            ) : (
              "Create Participant"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ParticipantForm;
