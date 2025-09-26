import { useState } from "react";
import { Modal, Button, Form, Alert, Spinner, Card } from "react-bootstrap";
import { authAPI } from "../../services/api";

const LoginModal = ({ show, onHide, onLoginSuccess, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(formData);

      if (response.data.success) {
        // Simpan token dan user data
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));

        onLoginSuccess(response.data.data.user);

        onHide();
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // const handleDemoLogin = (type) => {
  //   const demoAccounts = {
  //     super: { email: "himeansori@gmail.com", password: "password123" },
  //     admin: { email: "admin@event.com", password: "admin123" },
  //     user: { email: "user@event.com", password: "user123" },
  //   };

  //   setFormData(demoAccounts[type]);
  // };

  return (
    <Modal show={show} onHide={onHide} centered className="auth-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <div className="w-100 text-center">
          <div className="auth-icon">🔐</div>
          <h3 className="auth-title">Welcome Back</h3>
          <p className="auth-subtitle">Sign in to your account</p>
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
              <Form.Group className="mb-3">
                <Form.Label className="form-label">Email Address</Form.Label>
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

              <Form.Group className="mb-4">
                <Form.Label className="form-label">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={loading}
                  className="form-control-custom"
                  required
                />
              </Form.Group>

              <Button type="submit" variant="primary" size="lg" className="w-100 auth-button" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                    Signing In...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </Form>

            {/* <div className="text-center mt-4">
              <span className="auth-divider">or continue with</span>
            </div> */}

            {/* <div className="demo-accounts mt-3">
              <div className="row g-2">
                <div className="col-4">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="w-100 demo-button"
                    onClick={() => handleDemoLogin("super")}
                    disabled={loading}
                  >
                    Super Admin
                  </Button>
                </div>
                <div className="col-4">
                  <Button
                    variant="outline-success"
                    size="sm"
                    className="w-100 demo-button"
                    onClick={() => handleDemoLogin("admin")}
                    disabled={loading}
                  >
                    Admin
                  </Button>
                </div>
                <div className="col-4">
                  <Button
                    variant="outline-info"
                    size="sm"
                    className="w-100 demo-button"
                    onClick={() => handleDemoLogin("user")}
                    disabled={loading}
                  >
                    User
                  </Button>
                </div>
              </div>
            </div> */}

            <div className="auth-switch text-center mt-4">
              {/* <span className="text-muted">Don't have an account? </span> */}
              {/* <Button variant="link" className="auth-link p-0" onClick={onSwitchToRegister}>
                Sign up here
              </Button> */}
            </div>
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
};

export default LoginModal;
