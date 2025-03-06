import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-2">
        <input type="email" placeholder="Email" className="p-2 border" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="p-2 border" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="bg-blue-600 text-white p-2">Login</button>
      </form>
    </div>
  );
};

export default Login;
