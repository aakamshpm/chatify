import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImages,
  faPaperPlane,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import "./inputfield.scss";
import { useAuth } from "../../Context/AuthContext";
import { useChatContext } from "../../Context/ChatContext";
import { useState } from "react";
import {
  Timestamp,
  arrayUnion,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../utils/firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const InputField = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useAuth();
  const { data } = useChatContext();

  const handleSend = async () => {
    const storageRef = ref(storage, uuid());
    const uploadTask = uploadBytesResumable(storageRef, img);

    if (img) {
      uploadTask.on(
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log(downloadURL);
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                senderId: currentUser.uid,
                img: downloadURL,
                date: Timestamp.now(),
              }),
            });
          });
        }
      );
      setImg(null);
    } else if (text !== "") {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
      setText("");
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: { text },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: { text },
      [data.chatId + ".date"]: serverTimestamp(),
    });
  };
  return (
    <div className="msg-input">
      <input
        type="text"
        value={text}
        placeholder="Type your message"
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.code === "Enter" && handleSend()}
      />
      <div className="msg-input_options">
        <FontAwesomeIcon
          icon={faPaperclip}
          size="xl"
          style={{ color: "#2e343d", cursor: "pointer" }}
        />
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <FontAwesomeIcon
            icon={faImages}
            size="xl"
            style={{ color: "#2e343d", cursor: "pointer" }}
          />
        </label>
        <FontAwesomeIcon
          icon={faPaperPlane}
          size="xl"
          style={{ color: "#2e343d", cursor: "pointer" }}
          onClick={handleSend}
        />
      </div>
    </div>
  );
};

export default InputField;
