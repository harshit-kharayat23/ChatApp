import axios from "axios";
import { useEffect } from "react";
import { BACKEND_URL } from "../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../Redux/userSlice";

export const useCurrentUser = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((store) => store.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!token) return; // No token, skip fetch

        const res = await axios.get(`${BACKEND_URL}/getProfile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        dispatch(addUser({ user: res.data.userData, token }));
      } catch (err) {
        console.log("Error fetching current user:", err?.response?.data?.message || err.message);
      }
    };

    fetchUser();
  }, [dispatch, token]);
};
