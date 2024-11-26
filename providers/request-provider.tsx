"use client";

import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { useSession } from "./session-provider";

export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let token: string | undefined;
export function injectToken(_token: string | undefined) {
  token = _token;
}

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  config.headers = config.headers || {};
  config.headers["Access-Control-Allow-Origin"] = "*";

  if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  if (token && !config.headers["Authorization"]) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 422:
          error.code = "UNPROCESSABLE";
          break;

        case 403:
          error.code = "FORBIDDEN";
          break;

        case 404:
          error.code = "NOTFOUND";
          break;

        case 401:
          error.code = "UNAUTHORIZED";
          break;

        case 400:
          error.code = "BADREQUEST";
          break;

        default:
          console.error("Erro inesperado:", error);
          break;
      }
    }
    return Promise.reject(error);
  }
);