import { api } from "@/providers/request-provider";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { PURGE } from "redux-persist";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: {
    id?: number;
    name?: string | null;
    email?: string;
    createdAt?: string;
    updatedAt?: string;
  };
  user: {
    type?: string;
    name?: string | null;
    token?: string;
    abilities?: string[];
    lastUsedAt?: string | null;
    expiresAt?: string | null;
  };
}

export interface AuthState {
  loading: boolean;
  user: LoginResponse["user"];
  token: LoginResponse["token"];
  error: { message: string; code: string } | null;
}

const initialState: AuthState = {
  loading: false,
  user: {},
  token: {},
  error: null,
};

export const login = createAsyncThunk<LoginResponse, LoginRequest>(
  "auth/login",
  async (userData: LoginRequest) => {
    const res: AxiosResponse<LoginResponse> = await api.post(
      "/auth/login",
      userData
    );

    return res.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //login actions
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    });

    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = {
        message: action.error.message || "Ocorreu um erro",
        code: action.error.code || "UNEXPECTED",
      };
    });

    //purge slice
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export default authSlice.reducer;
