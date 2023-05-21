import { useEffect, useRef } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useChatContext } from "../../Context/ChatContext";
import moment from "moment";
import "./message.scss";

const Message = ({ message }) => {
  const { currentUser } = useAuth();
  const { data } = useChatContext();
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  let messageTime = "";

  moment()
    .startOf("day")
    .isSame(moment.unix(message.date.seconds).startOf("day"))
    ? (messageTime = moment.unix(message.date.seconds).format("HH:mm"))
    : (messageTime = moment.unix(message.date.seconds).format("MM-DD"));

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === currentUser.uid && "owner"}`}
    >
      <div className="message-info">
        <img
          src={
            message.senderId === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt="profile"
        />
        <p>{messageTime}</p>
      </div>
      <div className="message-content">
        {!message.img && <p>{message.text}</p>}
        {message.img && <img src={message.img} alt="photo" />}
      </div>
    </div>
  );
};

export default Message;
