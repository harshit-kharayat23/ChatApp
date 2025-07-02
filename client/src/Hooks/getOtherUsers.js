import axios from "axios";
import { useEffect } from "react";
import { BACKEND_URL } from "../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { addOtherUsers } from "../Redux/userSlice";

export const useOtherUsers = () => {
  const dispatch = useDispatch();
  const {userData} = useSelector((store) => store.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let response = await axios.get(BACKEND_URL + "/users", {
          withCredentials: true,
        });
        dispatch(addOtherUsers(response.data.users));
      } catch (err) {
        console.log("Error fetching other users:", err);
      }
    };

    fetchUsers();
  }, [userData]);
};
