import React, { useEffect, useState,useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import './Home.css';
import { auth } from "../firebase/firebase";
import { UserContext } from "../firebase/UserContext";

const Layout = () => {
    const [currentStudentEmail, setCurrentStudentEmail] = useState(null);
    const { currentUser } = useContext(UserContext);

    useEffect(() => {

        auth.onAuthStateChanged((user) => {
            if (user) {
                setCurrentStudentEmail(user.email);
            } else {
                console.log("User is logged out");
                setCurrentStudentEmail(null);
            }
        })
    }
        , [auth]);

    return (

        <div className="home-body">
            {/* Header Section */}
            <header>
                <div className="logo">
                    <Link to='/'>
                        <img
                            src="https://www.jecjabalpur.ac.in/images/logo.jpg"
                            alt="College Logo"

                        />
                    </Link>
                </div>
                <div className="college-name">
                    <h1>Jabalpur Engineering College</h1>
                    <p>Since 1947</p>
                </div>
            </header>

            {/* Navigation Menu */}
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/admin-list">admin lists</Link></li>
                    <li><Link to="/uploadex">uploadex</Link></li>
                    <li><Link to="/student-dashboard">Student Dashboard</Link></li>
                    <li><Link to="/">Contact Us</Link></li>
                    <li className="text-white">{currentUser ? currentUser.email : 'not logged in'}</li>
                </ul>
            </nav>

            {/* Main Content Section */}
            <div className="container">
                <Outlet />
            </div>

        </div>

    );
};

export default Layout;