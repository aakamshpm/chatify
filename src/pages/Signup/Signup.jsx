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
  const [errors, setErrors] = useState({});

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

  const onSignup = (displayName, userName, email, password) => {
    setLoading(true);
    console.log(displayName);

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

  const validateForm = (e) => {
    e.preventDefault();
    const displayName = e.target[0].value.trim();
    const userName = e.target[1].value.trim();
    const email = e.target[2].value.trim();
    const password = e.target[3].value.trim();
    const confirmPassword = e.target[4].value.trim(); 

    const newErrors = {};

    if (displayName === "") {
      newErrors.displayName = "Enter your name";
    } else if (!/^[A-Za-z]+$/.test(displayName)) {
      newErrors.displayName = "Enter a valid name!";
    }

    if (userName === "") {
      newErrors.userName = "Enter a username";
    }

    if (email === "") {
      newErrors.email = "Enter email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email!";
    }

    if (password === "") {
      newErrors.password = "Enter a password";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}/.test(
        password
      )
    ) {
      newErrors.password = "Entet a valid password!";
    }

    if(password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords doesn't match!"
    }

    setErrors(newErrors);

    Object.keys(newErrors).length === 0 && onSignup(displayName, userName, email, password);
   };

  return (
    <div className="register">
      <div className="signup-header">
        {/* <img src="" alt="logo" /> */}
        <h2>Register Now !</h2>
        <div />
      </div>
      <form onSubmit={validateForm}>
        <input type="text" placeholder="Name" />
        {errors.displayName && <span>{errors.displayName}</span>}

        <input type="text" placeholder="Username" />
        {errors.userName && <span>{errors.userName}</span>}

        <input type="email" placeholder="Email" />
        {errors.email && <span>{errors.email}</span>}

        <input type="password" placeholder="Password" />
        {errors.password && <span>{errors.password}</span>}

        <input type="password" placeholder="Confirm Password" />
        {errors.confirmPassword && <span>{errors.confirmPassword}</span>}

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
