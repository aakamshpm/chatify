import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faVideo,
  faEllipsisVertical,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import "./chatwindow.scss";
import { InputField, Messages } from "../";
import { useChatContext } from "../../Context/ChatContext";

const ChatWindow = ({ showChatWindow, setShowChatWindow }) => {
  const { data } = useChatContext();

  return (
    <div className={`chat-window ${showChatWindow && "show-chatWindow"}`}>
      {data.chatId === "null" ? (
        <div className="initial-chatwindow">
          <h1>
            Welcome to <span>Chatify</span>
          </h1>
        </div>
      ) : (
        <>
          <div className="header">
            <div className="header-name">
              {showChatWindow && (
                <FontAwesomeIcon
                  id="back-arrow"
                  icon={faArrowLeft}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowChatWindow(false)}
                />
              )}
              <h1>{data.user?.displayName}</h1>
            </div>
            <div className="header-options">
              <FontAwesomeIcon
                icon={faPhone}
                size="xl"
                style={{ color: "#ffffff5e", cursor: "pointer" }}
              />
              <FontAwesomeIcon
                icon={faVideo}
                size="xl"
                style={{ color: "#ffffff5e", cursor: "pointer" }}
              />
              <FontAwesomeIcon
                icon={faEllipsisVertical}
                size="xl"
                style={{ color: "#ffffff5e", cursor: "pointer" }}
              />
            </div>
          </div>
          <Messages />
          <InputField />
        </>
      )}
    </div>
  );
};

export default ChatWindow;
