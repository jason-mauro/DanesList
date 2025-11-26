import { useEffect, useState } from "react";

export function useAuth() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/auth/me`, {
      credentials: "include"
    })
      .then((res) => {
        if (res.ok) setAuthenticated(true);
      })
      .finally(() => setLoading(false));
  }, []);

  return { loading, authenticated };
}
