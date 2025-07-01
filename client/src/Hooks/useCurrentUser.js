import axios from "axios";
import { useEffect } from "react";
import { BACKEND_URL } from "../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../Redux/userSlice";



export const useCurrentUser = () => {
    let dispatch = useDispatch();
    let userData=useSelector(store=>store.user.loggedInUser);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let userDetails = await axios.get(BACKEND_URL + "/getProfile", {
          withCredentials: true,
        });
        dispatch(addUser(userDetails.data));
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);
};
