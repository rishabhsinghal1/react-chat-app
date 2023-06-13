import { signInWithEmailAndPassword } from "firebase/auth";
import { React, useState } from "react";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [err, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      // Login user
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/ ");
    } catch (err) {
      setError(true);
      console.log(err);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chit Chat</span>
        <span className="title">Login</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <button>Login</button>
        </form>
        <p>
          Dont have an account? <Link to="/register">Register</Link>
        </p>
        {err && <span className="error">Something went wrong</span>}
      </div>
    </div>
  );
};

export default Login;
