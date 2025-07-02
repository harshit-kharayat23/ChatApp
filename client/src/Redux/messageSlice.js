import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
  },

  reducers: {
    // set entire message array
    setMessages: (state, action) => {
      state.messages = action.payload;
    },

    // add a single new message
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setMessages, addMessage } = messageSlice.actions;
export default messageSlice.reducer;
