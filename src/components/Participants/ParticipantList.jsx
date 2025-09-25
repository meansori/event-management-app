import { useState, useEffect } from "react";
import { Table, Button, Card } from "react-bootstrap";
import { participantsAPI } from "../../services/api";
import ParticipantForm from "./ParticipantForm";

const ParticipantList = () => {
  const [participants, setParticipants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingParticipant, setEditingParticipant] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // ✅ harus ada
  const [loading, setLoading] = useState(false); // ✅ kalau mau pakai loading

  // 📡 Ambil data setiap refreshTrigger berubah
  useEffect(() => {
    fetchParticipants();
  }, [refreshTrigger]);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const response = await participantsAPI.getAll();
      console.log("📊 Participants API Response:", response.data);

      // ✅ Sesuaikan struktur responsenya
      setParticipants(response.data?.data || []);
    } catch (error) {
      console.error("❌ Error fetching participants:", error);
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this participant?")) {
      try {
        await participantsAPI.delete(id);
        fetchParticipants();
      } catch (error) {
        console.error("❌ Error deleting participant:", error);
      }
    }
  };

  const handleSaveSuccess = () => {
    // ✅ memicu useEffect agar data reload
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Participants Management</h5>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          + Add Participant
        </Button>
      </Card.Header>

      <Card.Body>
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <Table responsive hover>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Address</th>
                <th>Category ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {participants.length > 0 ? (
                participants.map((participant) => (
                  <tr key={participant.id}>
                    <td className="fw-semibold">{participant.full_name}</td>
                    <td>{participant.address}</td>
                    <td>{participant.category_id}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          setEditingParticipant(participant);
                          setShowForm(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(participant.id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    Tidak ada data peserta 😢
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>

      <ParticipantForm
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setEditingParticipant(null);
        }}
        participant={editingParticipant}
        onSave={handleSaveSuccess}
      />
    </Card>
  );
};

export default ParticipantList;
