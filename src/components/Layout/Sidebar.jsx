import { Nav } from "react-bootstrap";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "events", label: "Events", icon: "📅" },
    { key: "accounts", label: "Accounts", icon: "👥" },
    { key: "participants", label: "Participants", icon: "👤" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h6>Navigation Menu</h6>
      </div>
      <Nav className="flex-column">
        {menuItems.map((item) => (
          <Nav.Link
            key={item.key}
            href={`#${item.key}`}
            className={`sidebar-link ${activeTab === item.key ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(item.key);
            }}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Nav.Link>
        ))}
      </Nav>

      {/* Additional sidebar content */}
      <div className="sidebar-footer mt-auto p-3">
        <div className="text-center">
          <small className="text-muted">Event Management System v1.0</small>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
