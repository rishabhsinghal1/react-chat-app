import React, { useState } from "react";
import AddAvatar from "../img/addAvatar.png";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [err, setError] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      // Create user
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Create a unique image name
      const imageName = `${displayName}_${Date.now()}`;

      // Upload image to Firebase Storage
      const storageRef = ref(storage, imageName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress tracking if needed
        },
        (error) => {
          console.log(error);
        },
        async () => {
          // Image upload completed successfully
          const downloadURL = await getDownloadURL(storageRef);

          try {
            // Update user profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });

            // Create user in Firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          } catch (err) {
            setError(true);
            console.log(err);
          }
        }
      );
    } catch (err) {
      setError(true);
      console.log(err);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Chit Chat</span>
        <span className="title">Register</span>
        <form action="" onSubmit={handleSubmit}>
          <input type="text" placeholder="display name" />
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <input style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={AddAvatar} alt="" />
            <span>Add an Avatar</span>
          </label>
          <button type="submit">Register</button>
        </form>
        <p>
          You already have an account? <Link to="/login">Login</Link>
        </p>
        {err && <span className="error">Something went wrong</span>}
      </div>
    </div>
  );
};

export default Register;
