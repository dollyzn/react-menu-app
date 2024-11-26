import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

export interface AuthState {
  loading: boolean;
  user: User | null;

  error: { message: string; code: string } | null;
}

const initialState: AuthState = {
  loading: false,
  user: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    //purge slice
    builder.addCase(PURGE, () => {
      return initialState;
    });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
