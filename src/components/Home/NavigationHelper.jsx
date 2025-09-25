import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const NavigationHelper = ({ setActiveTab }) => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash && ["dashboard", "events", "accounts", "participants", "home"].includes(hash)) {
      setActiveTab(hash);
    }
  }, [location, setActiveTab]);

  return null;
};

export default NavigationHelper;
