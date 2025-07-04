import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    otherUsers: null,
    selectedUser: null,
    onlineUsers: [],
    token: null,
  },

  reducers: {
    addUser: (state, action) => {
      const { user, token } = action.payload;
      state.userData = user;
      state.token = token;
    },
    logOutUser: (state) => {
      state.userData = null;
      state.token = null;
      state.otherUsers = null;
      state.selectedUser = null;
      state.onlineUsers = [];
    },
    addOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const {
  addUser,
  addOtherUsers,
  setSelectedUser,
  setOnlineUsers,
  logOutUser,
} = userSlice.actions;

export default userSlice.reducer;
