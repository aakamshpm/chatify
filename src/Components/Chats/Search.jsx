import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./chats.scss";
import { useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../utils/firebase";
import { useAuth } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import { useChatContext } from "../../Context/ChatContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const { currentUser } = useAuth();
  const { dispatch } = useChatContext();

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("userName", "==", username)
    );
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          setUser(doc.data());
        });
      } else {
        toast.info("User not found !");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelect = async () => {
    dispatch({ type: "CHANGE_USER", payload: user})
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log(error);
    }

    setUser(null);
    setUsername("");
  };

  return (
    <>
      <div className="search-bar">
        <FontAwesomeIcon
          icon={faMagnifyingGlass}
          size="2x"
          style={{ color: "#ffffff5e" }}
          className="search-icon"
        />
        <input
          onKeyDown={(e) => e.code === "Enter" && handleSearch()}
          type="search"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      {user && (
        <div className="search-div" onClick={handleSelect}>
          <div className="search-results">
            <img src={user.photoURL} alt="profile" />
            <h2>{user.displayName}</h2>
          </div>
          <section />
        </div>
      )}
    </>
  );
};

export default Search;
