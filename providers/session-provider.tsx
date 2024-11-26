"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios, { AxiosInstance } from "axios";
import { encode, decode } from "../lib/jwt";
import { setCookie, removeCookie, getCookie } from "../lib/cookie";
import { injectToken } from "./request-provider";

interface SessionContextData {
  user: User | null;
  login: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionContextData>(
  {} as SessionContextData
);

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      const token = getCookie();
      if (token) {
        const decodedUser = decode(token);
        if (decodedUser) {
          try {
            const response = await api.get<User>("/auth/me", {
              headers: {
                Authorization: `Bearer ${decodedUser.token}`,
              },
            });
            if (response.data && response.data.id === decodedUser.id) {
              setUser(decodedUser);
            } else {
              removeCookie();
              setUser(null);
            }
          } catch (error) {
            removeCookie();
            setUser(null);
          }
        }
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    injectToken(user?.token);
  }, [user]);

  async function login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void> {
    try {
      const response = await api.post<User>("/auth/login", {
        email,
        password,
      });

      const data = response.data;
      const jwtToken = encode(data);

      setCookie(jwtToken);
      setUser(data);
    } catch (error: any) {
      throw error.response ? error.response.data : new Error("Login failed");
    }
  }

  async function logout() {
    if (user) {
      try {
        await api.post("/auth/logout", null, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
      } catch (error: any) {
        console.error("Logout failed", error);
      }
    }
    removeCookie();
    setUser(null);
  }

  return (
    <SessionContext.Provider value={{ user, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
