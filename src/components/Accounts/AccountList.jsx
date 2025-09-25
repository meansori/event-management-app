import { useState, useEffect } from "react";
import { Table, Button, Card } from "react-bootstrap";
import { accountsAPI } from "../../services/api";
import AccountForm from "./AccountForm";

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  // 📌 Ambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchAccounts();
  }, []);

  // 📡 Fungsi fetch data dari API
  const fetchAccounts = async () => {
    try {
      const response = await accountsAPI.getAll();
      console.log("📅 Accounts API Response:", response.data);

      // ✅ Sesuaikan struktur dengan response API kamu
      setAccounts(response.data.data || []);
    } catch (error) {
      console.error("❌ Error fetching accounts:", error);
      // fallback data kosong
      setAccounts([]);
    }
  };

  // 🗑️ Fungsi hapus akun
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this account?")) {
      try {
        await accountsAPI.delete(id);
        fetchAccounts(); // refresh data setelah delete
      } catch (error) {
        console.error("❌ Error deleting account:", error);
      }
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Accounts Management</h5>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          + Add Account
        </Button>
      </Card.Header>

      <Card.Body>
        <Table responsive hover>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.length > 0 ? (
              accounts.map((account) => (
                <tr key={account.id}>
                  <td className="fw-semibold">{account.full_name}</td>
                  <td>{account.email}</td>
                  <td>{account.role_id}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        setEditingAccount(account);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(account.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  Tidak ada data akun 😢
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>

      {/* 🧾 Modal Form Tambah/Edit */}
      <AccountForm
        show={showForm}
        onHide={() => {
          setShowForm(false);
          setEditingAccount(null);
        }}
        account={editingAccount}
        onSave={fetchAccounts}
      />
    </Card>
  );
};

export default AccountList;
