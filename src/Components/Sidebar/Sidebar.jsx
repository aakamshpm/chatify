import { toast } from "react-toastify";
import { auth } from "../../utils/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../../Context/AuthContext";
import "./sidebar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faHouse,
  faMessage,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";

const Sidebar = () => {
  const { currentUser } = useAuth();

  const onLogout = () => {
    signOut(auth)
      .then(() => {
        toast.info("Logged Out !");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-icons">
        <FontAwesomeIcon
          icon={faHouse}
          style={{ color: "#a1a1a1" }}
          size="xl"
        />
        <FontAwesomeIcon
          icon={faMessage}
          style={{ color: "#a1a1a1" }}
          size="xl"
        />
        <FontAwesomeIcon icon={faGear} style={{ color: "#a1a1a1" }} size="xl" />
      </div>
      <div className="sidebar-info">
        <img src={currentUser.photoURL} alt="photo" />
        <p>{currentUser.displayName}</p>
        <FontAwesomeIcon
          icon={faRightFromBracket}
          style={{ color: "#a1a1a1", cursor: "pointer" }}
          size="2xl"
          onClick={onLogout}
        />
      </div>
    </div>
  );
};

export default Sidebar;
