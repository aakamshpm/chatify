import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const onLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/", { replace: true });
      })
      .catch((error) => {
        // console.log(error.code);
        toast.error(error.code, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
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
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
      </div>
      <div className="login-controls">
        <button onClick={() => navigate("/signup")} type="button">
          Signup
        </button>
        <p onClick={onLogin}>Login</p>
      </div>
    </div>
  );
};

export default Login;
