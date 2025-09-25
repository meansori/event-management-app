import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { accountsAPI } from "../../services/api";

const AccountForm = ({ show, onHide, account, onSave }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    role_id: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (account) {
      setFormData({
        full_name: account.full_name || "",
        email: account.email || "",
        password: "", // Don't fill password for edit
        role_id: account.role_id || 1,
      });
    } else {
      setFormData({
        full_name: "",
        email: "",
        password: "",
        role_id: 1,
      });
    }
    setError("");
  }, [account, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const submitData = { ...formData };
      // Remove password if empty during edit
      if (account && !submitData.password) {
        delete submitData.password;
      }

      if (account) {
        await accountsAPI.update(account.id, submitData);
      } else {
        await accountsAPI.create(submitData);
      }
      onSave();
      onHide();
    } catch (error) {
      console.error("Error saving account:", error);
      setError("Failed to save account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{account ? "Edit Account" : "Add New Account"}</Modal.Title>
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
            <Form.Label>Email *</Form.Label>
            <Form.Control type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required disabled={loading} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password {account && <small className="text-muted">(leave empty to keep current)</small>}</Form.Label>
            <Form.Control type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required={!account} disabled={loading} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Role ID</Form.Label>
            <Form.Select value={formData.role_id} onChange={(e) => setFormData({ ...formData, role_id: parseInt(e.target.value) })} disabled={loading}>
              <option value={1}>Admin</option>
              <option value={2}>User</option>
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
                {account ? "Updating..." : "Creating..."}
              </>
            ) : account ? (
              "Update Account"
            ) : (
              "Create Account"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AccountForm;
