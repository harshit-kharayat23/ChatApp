import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../assets/assets";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { CiLogout } from "react-icons/ci";
import { BACKEND_URL } from "../lib/utils.js";
import { addUser } from "../Redux/userSlice.js";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const navigate = useNavigate();
  const {userData} = useSelector((store) => store?.user);
  const dispatch = useDispatch();

  const [name, setName] = useState(userData.fullName || "");
  const [bio, setBio] = useState(userData.bio || "");
  const [frontEndImg, setFrontEndImg] = useState(userData?.photo);
  const [backendImg, setBackEndImg] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackEndImg(file);
    setFrontEndImg(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    setSaving(true);
    e.preventDefault();
    try {
      let formData = new FormData();
      formData.append("fullName", name);
      formData.append("bio", bio);
      if (backendImg) {
        formData.append("photo", backendImg);
      }
      let updatedUser = await axios.put(
        BACKEND_URL + "/updateProfile",
        formData,
        { withCredentials: true }
      );
      setSaving(false)
      toast.success( updatedUser.data.message ||"Profile Saved")
      dispatch(addUser(updatedUser.data.userData));
      navigate("/");
    } catch (err) {
  console.log(err);
  toast.error(err?.response?.data?.message || "Error Occurred");
  setSaving(false);
}

  };

  return (
    <>
        <CiLogout 
      onClick={() => navigate("/")}
      className="text-3xl text-white cursor-pointer fixed top-5 right-5 z-50"
    />

    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3 className="text-lg">Profile details</h3>

          {/* Image Upload Input */}
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={handleImage}
              type="file"
              id="avatar"
              accept="image/*"
              hidden
            />
            <img
              src={frontEndImg || assets.avatar_icon}
              alt="profile-preview"
              className="w-12 h-12 rounded-full object-cover"
            />
            Upload profile image
          </label>

          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            required
            placeholder="Your name"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            placeholder="Write profile bio"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            rows={4}
          ></textarea>

          <button
            type="submit"
            className="bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer"
            disabled={saving}
          >
            {saving?"Saving...":"Save Profile"}
          </button>
        </form>

        {/* Right Side Profile Preview */}
        <img
          className="max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 object-cover"
          src={frontEndImg || assets.avatar_icon}
          alt="profile-preview"
        />
      </div>
    </div>
    </>
  );
};

export default ProfilePage;
