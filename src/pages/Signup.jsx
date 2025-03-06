import { useState } from "react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    console.log({ name, email, password });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Signup</h1>
      <form onSubmit={handleSignup} className="flex flex-col gap-2">
        <input type="text" placeholder="Name" className="p-2 border" onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" className="p-2 border" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="p-2 border" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="bg-blue-600 text-white p-2">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
