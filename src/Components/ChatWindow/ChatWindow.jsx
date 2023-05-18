import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faVideo,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import "./chatwindow.scss";
import { InputField, Messages } from "../";
import { useChatContext } from "../../Context/ChatContext";

const ChatWindow = () => {
  const { data } = useChatContext();

  console.log(data.chatId);

  return (
    <div className="chat-window">
      {data.chatId === "null" ? (
        
        <div className="initial-chatwindow">  
          <h1>
            Welcome to <span>Chatify</span>
          </h1>
        </div>
      ) : (
        <>
          <div className="header">
            <h1>{data.user?.displayName}</h1>
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
