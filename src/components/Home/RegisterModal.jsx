import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert, Spinner, Card, Row, Col } from "react-bootstrap";
import { authAPI } from "../../services/api";

const RegisterModal = ({ show, onHide, onLoginSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role_id: 2,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roles, setRoles] = useState([]);
  const [passwordStrength, setPasswordStrength] = useState("");

  useEffect(() => {
    if (show) {
      fetchRoles();
      setError("");
      setFormData({
        full_name: "",
        email: "",
        password: "",
        confirm_password: "",
        role_id: 2,
      });
    }
  }, [show]);

  useEffect(() => {
    checkPasswordStrength(formData.password);
  }, [formData.password]);

  const fetchRoles = async () => {
    try {
      const response = await authAPI.getRoles();
      setRoles(response.data.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length === 0) {
      setPasswordStrength("");
      return;
    }

    if (password.length < 6) {
      setPasswordStrength("weak");
    } else if (password.length < 8) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.register({
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        role_id: formData.role_id,
      });

      if (response.data.success) {
        // Simpan token dan user data
        localStorage.setItem("authToken", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));

        onLoginSuccess(response.data.data.user);
        onHide();
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "#dc3545";
      case "medium":
        return "#ffc107";
      case "strong":
        return "#28a745";
      default:
        return "#e9ecef";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case "weak":
        return "Weak";
      case "medium":
        return "Medium";
      case "strong":
        return "Strong";
      default:
        return "";
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered className="auth-modal" size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <div className="w-100 text-center">
          <div className="auth-icon">👤</div>
          <h3 className="auth-title">Create Account</h3>
          <p className="auth-subtitle">Join our event management system</p>
        </div>
      </Modal.Header>

      <Modal.Body className="pt-0">
        <Card className="auth-card">
          <Card.Body className="p-4">
            {error && (
              <Alert variant="danger" className="auth-alert">
                <span className="alert-icon">⚠️</span>
                <span>{error}</span>
              </Alert>
            )}

            <Form onSubmit={handleSubmit} className="auth-form">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      disabled={loading}
                      className="form-control-custom"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">Email Address *</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={loading}
                      className="form-control-custom"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">Password *</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      disabled={loading}
                      className="form-control-custom"
                      required
                      minLength={6}
                    />
                    {formData.password && (
                      <div className="password-strength mt-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <small>Password strength:</small>
                          <small style={{ color: getPasswordStrengthColor() }}>{getPasswordStrengthText()}</small>
                        </div>
                        <div
                          className="password-strength-bar mt-1"
                          style={{
                            backgroundColor: getPasswordStrengthColor(),
                            width: passwordStrength === "weak" ? "33%" : passwordStrength === "medium" ? "66%" : "100%",
                          }}
                        ></div>
                      </div>
                    )}
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">Confirm Password *</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirm_password}
                      onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                      disabled={loading}
                      className="form-control-custom"
                      required
                    />
                    {formData.confirm_password && formData.password === formData.confirm_password && (
                      <small className="text-success">✓ Passwords match</small>
                    )}
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-4">
                <Form.Label className="form-label">Account Type</Form.Label>
                <Form.Select
                  value={formData.role_id}
                  onChange={(e) => setFormData({ ...formData, role_id: parseInt(e.target.value) })}
                  disabled={loading}
                  className="form-control-custom"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">Choose your account type based on your needs</Form.Text>
              </Form.Group>

              <Button type="submit" variant="primary" size="lg" className="w-100 auth-button" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </Form>

            <div className="auth-switch text-center mt-4">
              <span className="text-muted">Already have an account? </span>
              <Button variant="link" className="auth-link p-0" onClick={onSwitchToLogin}>
                Sign in here
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
};

export default RegisterModal;
