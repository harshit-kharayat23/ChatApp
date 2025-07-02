import axios from "axios";
import { useEffect } from "react";
import { BACKEND_URL } from "../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../Redux/messageSlice";

export const useGetMessages = () => {
  const dispatch = useDispatch();
  const { userData, selectedUser } = useSelector((store) => store.user);

  useEffect(() => {
    if (!selectedUser || !userData) return; // prevent premature fetch

    const fetchMessages = async () => {
      try {
        const result = await axios.get(
          `${BACKEND_URL}/getMessages/${selectedUser._id}`,
          { withCredentials: true }
        );
        console.log(result);
        dispatch(setMessages(result.data.messages));
      } catch (err) {
        console.error("Error fetching messages: ", err);
      }
    };

    fetchMessages();
  }, [selectedUser, userData]);
};
