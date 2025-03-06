import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-red-500 p-4 text-white">
      <ul className="flex gap-4">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/signup">Signup</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/submit-project">Submit Project</Link></li>
        <li><Link to="/notice-board">Notice Board</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
