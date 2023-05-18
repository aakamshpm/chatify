import { useEffect, useState } from "react";
import { useChatContext } from "../../Context/ChatContext";
import Message from "../Message/Message";
import "./messages.scss";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../utils/firebase";

const Messages = () => {
  const { data } = useChatContext();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unsub();
    }
  }, [data.chatId]);

  return (
    <div className="messages">
     {
      messages.map((message)=>(
        <Message message={message} key={message.id} />
      ))
     }
    </div>
  );
};

export default Messages;
