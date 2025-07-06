import React, { useEffect, useRef, useState } from "react";
import assets from "../assets/assets";
import { BACKEND_URL, formatMessageTime } from "../lib/utils";
import { useSelector, useDispatch } from "react-redux";
import { RiEmojiStickerFill } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import { setSelectedUser } from "../Redux/userSlice";
import { addMessage, replaceMessage } from "../Redux/messageSlice";
import { CiLogout } from "react-icons/ci";
import { useSocket } from "../contexts/SocketContext";

const ChatContainer = () => {
  const scrollEnd = useRef();
  const dispatch = useDispatch();
  const imageRef = useRef();

  const { userData, selectedUser, onlineUsers } = useSelector(
    (store) => store.user
  );
  const { messages } = useSelector((store) => store.message);

  const [message, setMessage] = useState("");
  const [frontEndImg, setFrontEndImg] = useState(null);
  const [backendImg, setBackEndImg] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [showProfileSidebar, setShowProfileSidebar] = useState(false);

  const userId = userData?._id;

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackEndImg(file);
    setFrontEndImg(URL.createObjectURL(file));
  };

  const sendMessage = async () => {
    if (!message.trim() && !backendImg) return;

    const tempId = "temp-" + Date.now();

    const tempMessage = {
      _id: tempId,
      senderId: { _id: userData._id, photo: userData.photo },
      text: message,
      image: frontEndImg,
      createdAt: new Date().toISOString(),
      isTemp: true,
    };

    dispatch(addMessage(tempMessage));

    const formData = new FormData();
    formData.append("text", message);
    if (backendImg) formData.append("image", backendImg);

    try {
      const token = localStorage.getItem("token"); // 🔐 Get token

      const result = await axios.post(
        `${BACKEND_URL}/sendMessage/${selectedUser._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🟢 Attach Bearer token
          },
        }
      );

      dispatch(replaceMessage({ tempId, newMessage: result.data.newMessage }));
    } catch (err) {
      console.error("Message send failed", err);
    }

    resetInputs();
  };

  const resetInputs = () => {
    setMessage("");
    setBackEndImg(null);
    setFrontEndImg(null);
    imageRef.current.value = "";
  };

  const handleImageScroll = () => {
    scrollEnd.current?.scrollIntoView({ behavior: "smooth" });
  };

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (msg) => {
      dispatch(addMessage(msg));
    });

    return () => {
      socket.off("newMessage");
    };
  }, [dispatch, socket]);

  useEffect(() => {
    handleImageScroll();
  }, [messages]);

  const renderMessage = (msg, index) => (
    <div
      key={index}
      className={`flex items-end gap-2 ${
        msg.senderId._id === userId ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex flex-col max-w-[260px] p-2 mb-8 relative ${
          msg.senderId._id === userId
            ? "bg-violet-500/30 rounded-lg rounded-br-none"
            : "bg-violet-500/30 rounded-lg rounded-bl-none"
        }`}
      >
        {msg.image && (
          <div className="relative">
            <img
              src={msg.image}
              alt="Sent media"
              className="border border-gray-700 rounded-lg overflow-hidden mb-2 max-h-[250px] w-auto object-cover"
              onLoad={handleImageScroll}
            />
            {msg.isTemp && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        )}

        {msg.text && (
          <p className="md:text-sm font-light break-all text-white">
            {msg.text}
          </p>
        )}
      </div>

      <div className="text-center text-xs">
        <img
          src={msg.senderId.photo}
          alt="avatar"
          className="w-7 rounded-full"
        />
        <p className="text-gray-500">{formatMessageTime(msg.createdAt)}</p>
      </div>
    </div>
  );

  const renderPreviewImage = () =>
    frontEndImg && (
      <img
        src={frontEndImg}
        alt="preview"
        className="w-[80px] absolute bottom-24 right-7 rounded-md"
      />
    );

  if (!selectedUser)
    return (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-50 bg-white/10 max-md:hidden">
        <img src={assets.logo_icon} className="w-16" alt="Logo" />
        <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
      </div>
    );

  return (
    <div className="h-full overflow-y-scroll relative backdrop-blur-lg p-2 cursor-pointer">
      {/* header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.photo}
          className="w-8 rounded-full cursor-pointer"
          alt="User"
          onClick={() => setShowProfileSidebar(true)}
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <CiLogout
          className="md:hidden w-6 cursor-pointer font-bold text-2xl"
          onClick={() => dispatch(setSelectedUser(null))}
        />
      </div>

      {/* Chat area or Profile Sidebar on mobile */}
      {showProfileSidebar ? (
        // Mobile Profile Sidebar
        <div className="flex flex-col items-center gap-3 p-4 text-white">
          <button
            onClick={() => setShowProfileSidebar(false)}
            className="self-start text-xs text-white px-2 py-1 rounded bg-violet-600"
          >
            ← Back to Chat
          </button>
          <img
            src={selectedUser.photo}
            className="w-25 aspect-square rounded-full object-cover"
            alt={selectedUser.fullName}
          />
          <p className="text-lg">{selectedUser.fullName}</p>
          <p className="text-md text-gray-300">
            {selectedUser.bio || "Hey there, I'm using QuickChat!"}
          </p>
          <div className="px-5 text-xs overflow-hidden">
            <p className="text-sm text-gray-200 mb-2 font-medium">Media</p>
            <div className="max-h-[450px] md:max-h-[270px] lg:md:max-h-[250px]  overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2">
              {messages
                .filter((msg) => msg.image)
                .slice()
                .reverse()
                .map((msg, index) => (
                  <div
                    key={index}
                    onClick={() => window.open(msg.image, "_blank")}
                    className="cursor-pointer overflow-hidden rounded"
                  >
                    <img
                      src={msg.image}
                      alt="media"
                      className="w-full h-24 sm:h-28 object-cover rounded-md"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : (
        // Chat area
        <>
          <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
            {messages.map(renderMessage)}
            <div ref={scrollEnd} />
          </div>
          {renderPreviewImage()}
          {/* bottom input */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
            <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
              <RiEmojiStickerFill
                onClick={() => setShowPicker((prev) => !prev)}
                className="h-[25px] w-[25px] cursor-pointer"
              />
              <input
                type="text"
                value={message}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && message.trim()) {
                    sendMessage();
                  }
                }}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Send a message"
                className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent"
              />
              <input
                type="file"
                id="image"
                accept="image/*"
                ref={imageRef}
                hidden
                onChange={handleImage}
              />
              <label htmlFor="image">
                <img
                  src={assets.gallery_icon}
                  alt="Upload"
                  className="w-5 mr-2 cursor-pointer"
                />
              </label>
            </div>
            <img
              src={assets.send_button}
              alt="Send"
              className="w-7 cursor-pointer"
              onClick={sendMessage}
            />
          </div>
        </>
      )}

      {showPicker && (
        <div className="absolute bottom-16 left-3 z-50">
          <EmojiPicker
            theme="dark"
            onEmojiClick={(emojiData) => {
              setMessage((prev) => prev + emojiData.emoji);
              setShowPicker(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
