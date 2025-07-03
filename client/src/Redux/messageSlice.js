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
    replaceMessage: (state, action) => {
      const { tempId, newMessage } = action.payload;
      const index = state.messages.findIndex((msg) => msg._id === tempId);
      if (index !== -1) {
        state.messages[index] = newMessage;
      }
    },
  },
});

export const { setMessages, addMessage, replaceMessage } = messageSlice.actions;
export default messageSlice.reducer;
