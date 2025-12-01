import axios from "axios";
import { useEffect, useState } from "react";

export function useAuth() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/auth/me`, {
          withCredentials: true
        });
  
        setAuthenticated(true);
        setIsAdmin(response.data.user.isAdmin);
      } catch (error: any) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { loading, authenticated, isAdmin };
}
