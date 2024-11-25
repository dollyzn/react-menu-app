"use client";

import { Store } from "@reduxjs/toolkit";
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

let store: Store;

export const injectStore = (_store: Store) => {
  store = _store;
};

api.interceptors.request.use(async (config) => {
  config.headers["Access-Control-Allow-Origin"] = "*";

  if (config.headers["Content-Type"] === undefined) {
    config.headers["Content-Type"] = "application/json";
  }

  const userToken = store.getState().auth?.token?.token;
  const sessionExpired = store.getState().auth?.sessionExpired;

  if (
    !sessionExpired &&
    userToken &&
    config.headers["Authorization"] === undefined
  ) {
    config.headers["Authorization"] = `Bearer ${userToken}`;
  }

  return config;
});

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
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
          // if (window.location.pathname !== "/") {
          //   store.dispatch(expireSession());
          // }
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
