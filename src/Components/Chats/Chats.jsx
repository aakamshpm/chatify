import { useEffect, useState } from "react";
import "./chats.scss";
import Search from "./Search";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useAuth } from "../../Context/AuthContext";
import { useChatContext } from "../../Context/ChatContext";
import ChatWindow from "../ChatWindow/ChatWindow";

const Chats = () => {
  const [chats, setChats] = useState({});
  const { currentUser } = useAuth();
  const { dispatch } = useChatContext();
  const [showChatWindow, setShowChatWindow] = useState(false);

  useEffect(() => {
    const getUserChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };
    currentUser?.uid && getUserChats();
  }, [currentUser.uid]);

  const handleSelect = (userInfo) => {
    setShowChatWindow(true);
    dispatch({ type: "CHANGE_USER", payload: userInfo });
  };

  return (
    <div className="overall-window">
      <div className={`chats ${showChatWindow && "hide-chats"}`}>
        <Search setShowChatWindow={setShowChatWindow} />
        {Object.keys(chats).length > 0 ? (
          <div className="all-chats">
            {Object.entries(chats)
              ?.sort((a, b) => b[1].date - a[1].date)
              .map((chat) => (
                <div
                  key={chat[0]}
                  className="individual-chat"
                  onClick={() => handleSelect(chat[1].userInfo)}
                >
                  <img src={chat[1]?.userInfo.photoURL} alt="profile" />
                  <div className="chat-info">
                    <h2>{chat[1]?.userInfo.displayName}</h2>
                    <p>{chat[1]?.lastMessage?.text}</p>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="no-chats">
            <h2>Oops :(</h2>
            <p>Search for an user to start chat!</p>
          </div>
        )}
      </div>

      <ChatWindow
        showChatWindow={showChatWindow}
        setShowChatWindow={setShowChatWindow}
      />
    </div>
  );
};

export default Chats;
