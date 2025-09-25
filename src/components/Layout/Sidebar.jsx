import { Nav } from "react-bootstrap";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "events", label: "Events", icon: "📅" },
    { key: "accounts", label: "Accounts", icon: "👥" },
    { key: "participants", label: "Participants", icon: "👤" },
  ];

  return (
    <div className="bg-light border-end" style={{ width: "250px", minHeight: "100vh" }}>
      <Nav className="flex-column p-3">
        {menuItems.map((item) => (
          <Nav.Link
            key={item.key}
            href={`#${item.key}`}
            className={`mb-2 rounded ${activeTab === item.key ? "bg-primary text-white" : "text-dark"}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(item.key);
            }}
          >
            <span className="me-2">{item.icon}</span>
            {item.label}
          </Nav.Link>
        ))}
      </Nav>
    </div>
  );
};

export default Sidebar;
