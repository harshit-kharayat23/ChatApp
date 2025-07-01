import React, { useEffect, useRef, useState } from "react";
import assets, { messagesDummyData } from "../assets/assets";
import { formatMessageTime } from "../lib/utils";
import { useSelector } from "react-redux";
import { RiEmojiStickerFill } from "react-icons/ri";
import EmojiPicker from "emoji-picker-react";

const ChatContainer = ({ selectedUser, setSelectUser }) => {
  const scrollEnd = useRef();
  const { loggedInUser, otherUsers } = useSelector((store) => store?.user);
  const [showPicker, setShowPicker] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesDummyData]);

  return selectedUser ? (
    <div className="h-full overflow-y-scroll relative backdrop-blur-lg">
      {/* header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={assets.profile_martin}
          className="w-8 rounded-full"
          alt="User"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser?.fullName || "User"}
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </p>
        <img
          onClick={() => setSelectUser(null)}
          src=""
          className="md:hidden max-w-7"
          alt="Back"
        />
        <img
          src={assets.help_icon}
          className="max-md:hidden max-w-5"
          alt="Help"
        />
      </div>

      {/* chat area */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messagesDummyData.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 ${
              msg.senderId === "680f50e4f10f3cd28382ecf9"
                ? "justify-end"
                : "justify-start flex-row-reverse"
            }`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt="Sent media"
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${
                  msg.senderId === "680f50e4f10f3cd28382ecf9"
                    ? "rounded-br-none"
                    : "rounded-bl-none"
                }`}
              >
                {msg.text}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === "680f50e4f10f3cd28382ecf9"
                    ? assets.avatar_icon
                    : assets.profile_martin
                }
                alt="avatar"
                className="w-7 rounded-full"
              />
              <p className="text-gray-500">{formatMessageTime(msg.createdAt)}</p>
            </div>
          </div>
        ))}

        {/* Scroll to bottom anchor */}
        <div ref={scrollEnd} />
      </div>

      {/* ------- bottom area ------- */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <RiEmojiStickerFill
            onClick={() => setShowPicker((prev) => !prev)}
            className="h-[25px] w-[25px] cursor-pointer"
          />

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400"
          />

          <input type="file" id="image" accept="image/png, image/jpeg" hidden />
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
          // onClick={() => sendMessage(message)}  <-- connect your send message function here
        />
      </div>

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
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-50 bg-white/10 max-md:hidden">
      <img src={assets.logo_icon} className="w-16" alt="Logo" />
      <p className="text-lg font-medium text-white">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
