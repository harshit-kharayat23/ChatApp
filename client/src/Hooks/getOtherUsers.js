import axios from "axios";
import { useEffect } from "react";
import { BACKEND_URL } from "../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { addOtherUsers } from "../Redux/userSlice";

export const useOtherUsers = () => {
  const dispatch = useDispatch();
  const { userData, token } = useSelector((store) => store.user);

  useEffect(() => {
    if (!userData || !token) return; // wait for both user and token

    const fetchUsers = async () => {
      try {
        const response = await axios.get(BACKEND_URL + "/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(addOtherUsers(response.data.users));
      } catch (err) {
        console.log("Error fetching other users:", err?.response?.data?.message || err.message);
      }
    };

    fetchUsers();
  }, [userData, token, dispatch]);
};
