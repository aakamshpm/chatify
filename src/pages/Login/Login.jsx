import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./login.scss";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleQuestion,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showToolTip, setShowToolTip] = useState(false);

  const navigate = useNavigate();

  const onLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/", { replace: true });
      })
      .catch((error) => {
        toast.error("Incorrect email or password!");
        console.log(error.code);
      });
  };

  const validateForm = () => {
    const newErrors = {};

    if (email.trim() === "") {
      newErrors.email = "Enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Enter a valid email;";
    }
    setErrors(newErrors);

    if (password.trim() === "") {
      newErrors.password = "Enter your password";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{8,}/.test(
        password.trim()
      )
    ) {
      newErrors.password = "Entet a valid password!";
    }

    Object.keys(newErrors).length === 0 && onLogin();
  };

  return (
    <div className="container">
      <div className="login-header">
        {/* <img src="" alt="logo" /> */}
        <h2>Let's Chat !</h2>
        <div />
      </div>
      <div className="login-input">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
        />
        {errors.email && <span>{errors.email}</span>}
        <div className="password-input">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            onKeyDown={(e) => e.code === "Enter" && validateForm()}
          />
          <FontAwesomeIcon
            icon={showPassword ? faEyeSlash : faEye}
            style={{ color: "#fff", margin: "3em 0 0 1em", cursor: "pointer" }}
            onClick={() => setShowPassword((prev) => !prev)}
          />
          <div className="hover-box">
            <FontAwesomeIcon
              icon={faCircleQuestion}
              className="question-button"
              onClick={() => setShowToolTip((prev) => !prev)}
            />
            {showToolTip && (
              <div className="tool-tip">
                Password must be at least 8 characters long and contain at least
                one uppercase letter, one lowercase letter, one number, and one
                special character
              </div>
            )}
          </div>
        </div>
        {errors.password && <span>{errors.password}</span>}
        {showToolTip && (
              <div className="tool-tip">
                Password must be at least 8 characters long and contain at least
                one uppercase letter, one lowercase letter, one number, and one
                special character
              </div>
            )}
      </div>
      <div className="login-controls">
        <button onClick={() => navigate("/signup")} type="button">
          Signup
        </button>
        <p onClick={validateForm}>Login</p>
      </div>
    </div>
  );
};

export default Login;
