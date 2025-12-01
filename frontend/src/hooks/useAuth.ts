import axios from "axios";
import { useEffect, useState } from "react";
import type {User} from "../types/user.type"
export function useAuth() {
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const refreshUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        withCredentials: true
      });
      setAuthenticated(true);
      setUser(response.data.user);
      setIsAdmin(response.data.user.isAdmin);
    } catch (err) {
      setAuthenticated(false);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refreshUser() }, []);


  return { loading, authenticated, isAdmin, user, refreshUser };
}
