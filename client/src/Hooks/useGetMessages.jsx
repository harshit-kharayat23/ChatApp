import axios from "axios";
import { useEffect } from "react";
import { BACKEND_URL } from "../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../Redux/messageSlice";

export const useGetMessages = () => {
  const dispatch = useDispatch();
  const { userData, selectedUser, token } = useSelector((store) => store.user);

  useEffect(() => {
    if (!selectedUser || !userData || !token) return; // ensure all required data

    const fetchMessages = async () => {
      try {
        const result = await axios.get(
          `${BACKEND_URL}/getMessages/${selectedUser._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(setMessages(result.data.messages));
      } catch (err) {
        console.error("Error fetching messages: ", err?.response?.data?.message || err.message);
      }
    };

    fetchMessages();
  }, [selectedUser, userData, token, dispatch]);
};
