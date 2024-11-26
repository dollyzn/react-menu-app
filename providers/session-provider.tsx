"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { encode, decode } from "../lib/jwt";
import { setCookie, removeCookie, getCookie } from "../lib/cookie";
import { useRouter } from "next/navigation";
import { api } from "./request-provider";

export interface LoginError {
  message: string;
  invalidCredentials: boolean;
}
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

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const token = getCookie();
      if (token) {
        const decodedUser = decode(token);
        if (decodedUser) {
          try {
            const response = await api.get<User>("/auth/me");
            if (response.data && response.data.id === decodedUser.id) {
              setUser(decodedUser);
            } else {
              removeCookie();
              setUser(null);
              redirect();
            }
          } catch (error) {
            removeCookie();
            setUser(null);
            redirect();
          }
        } else {
          redirect();
        }
      }
    }
    function redirect() {
      router.push("/auth/login");
    }
    fetchUser();
  }, []);

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
      const token = encode(data);

      if (!data || !token) throw new Error("Login failed");

      setCookie(token);
      setUser(data);
    } catch (error: any) {
      const isCredentialsInvalid =
        error.response?.data?.message === "Invalid user credentials";
      throw error.response
        ? { ...error.response.data, invalidCredentials: isCredentialsInvalid }
        : new Error("Login failed");
    }
  }

  async function logout() {
    if (user) {
      try {
        await api.post("/auth/logout");
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
