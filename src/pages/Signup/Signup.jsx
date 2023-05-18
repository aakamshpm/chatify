import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./signup.scss";
import {
  faCircleNotch,
  faCloudArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { auth, db, storage } from "../../utils/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import profile from "../../assets/images/user.png";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [img, setImg] = useState(null);

  useEffect(() => {
    fetch(profile)
      .then((response) => response.blob())
      .then((blob) => {
        setImg(new File([blob], "image.png"), {
          type: "image/png",
        });
      })
      .catch((error) => {
        console.log("Error fetching image:", error);
      });
  }, []);

  const onSignup = (e) => {
    e.preventDefault();
    setLoading(true);
    const displayName = e.target[0].value;
    const userName = e.target[1].value;
    const email = e.target[2].value;
    const password = e.target[3].value;

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const storageRef = ref(storage, displayName);
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          (error) => {
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                await updateProfile(user, {
                  displayName,
                  photoURL: downloadURL,
                });
                await setDoc(doc(db, "users", user.uid), {
                  uid: user.uid,
                  displayName,
                  userName,
                  email,
                  photoURL: downloadURL,
                });
                await setDoc(doc(db, "userChats", user.uid), {});
                setLoading(false);
                navigate("/");
              }
            );
          }
        );
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.code);
      });
  };

  return (
    <div className="register">
      <div className="signup-header">
        {/* <img src="" alt="logo" /> */}
        <h2>Register Now !</h2>
        <div />
      </div>
      <form onSubmit={onSignup}>
        <input type="text" placeholder="Name" />
        <input type="text" placeholder="Username" />
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="Confirm Password" />
        <input
          onChange={(e) => setImg(e.target.files[0])}
          type="file"
          id="file"
          style={{ display: "none" }}
        />
        <label htmlFor="file">
          <FontAwesomeIcon
            style={{ color: "#fff", cursor: "pointer" }}
            size="lg"
            icon={faCloudArrowUp}
          />
          <p>Upload photo</p>
        </label>
        <button type="submit">
          {loading && (
            <FontAwesomeIcon icon={faCircleNotch} id="spinning-circle" />
          )}
          <span>Signup</span>
        </button>
      </form>
    </div>
  );
};

export default Signup;
