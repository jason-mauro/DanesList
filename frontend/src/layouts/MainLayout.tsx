import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../Components/Sidebar";

export const MainLayout: React.FC = () => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : {};
  });

  // Refresh user info on route change (like after account update)
  const location = useLocation();
  useEffect(() => {
    const latest = localStorage.getItem("user");
    if (latest) setUser(JSON.parse(latest));
  }, [location.pathname]);

  return (
    <div className="dl-layout">
      <Sidebar isOpen={true} user={user} />
      <main className="dl-main">
        <Outlet />
      </main>
    </div>
  );
};