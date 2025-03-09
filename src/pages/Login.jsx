import { useState } from "react";
import { auth } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleStudentLogin = async (event) => {
    // Student Login Logic
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user
      console.log(user);
      toast.success("Login successful!",{position: "top-center"});  
      navigate("/student-dashboard");
    }
    catch (error) {
      console.error("Error logging in:", error);
      toast.error("Error logging in: " + error.message,{position: "top-center"});
    }
  }

  const handleHodLogin = async (event) => { 
  }

  const handleProHeadLogin = async (event) => {
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleStudentLogin} className="flex flex-col gap-2">
        <input type="email" placeholder="Email" className="p-2 border" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="p-2 border" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="bg-blue-600 text-white p-2">Login</button>
      </form>
    </div>
  );
};

export default Login;
