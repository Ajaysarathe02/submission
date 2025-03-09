import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Home.css';
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const [role, setRole] = useState("");
    const [userlist, setUserlist] = useState([]);
    const [notifications, setNotifications] = useState([]);

    // Student Login Form State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // HOD Signup Form State
    const [hodEmail, setHodEmail] = useState("");
    const [hodPassword, setHodPassword] = useState("");

    // Project Head Signup Form State
    const [projectHeadEmail, setProjectHeadEmail] = useState("");
    const [projectHeadPassword, setProjectHeadPassword] = useState("");

    // Student Login Logic
    const handleStudentLogin = async (event) => {
        event.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user
            console.log(user);
            toast.success("Login successful!", { position: "top-center" });
            navigate("/student-dashboard", { state: { role: "STUDENT" } });
        }
        catch (error) {
            console.error("Error logging in:", error);
            toast.error("Error logging in: " + error.message, { position: "top-center" });
        }
    }

    // Hod Login Logic
    const handleHodLogin = async (event) => {
        event.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, hodEmail, hodPassword)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log(user);
                    toast.success("Login successful!", { position: "top-center" });
                    navigate("/hod-dash", { state: { role: "HOD" } });
                }
                );
        } catch (error) {
            console.error("Error logging in:", error);
            toast.error("Error logging in: " + error.message, { position: "top-center" });
        }
    };

    // Project Head Login Logic
    const handleProjectHeadLogin = async (event) => {
        event.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, projectHeadEmail, projectHeadPassword).
                then((userCredential) => {
                    const user = userCredential.user;
                    toast.success("Login successful!", { position: "top-center" });
                    navigate("/projecthead-dash", { state: { role: "PROJECTHEAD" } });
                });

        } catch (error) {
            console.error("Error logging in:", error);
            toast.error("Error logging in: " + error.message, { position: "top-center" });
        }
    };

    const fetchStudents = async () => {
        const studentDocs = await getDocs(collection(db, "students"));
        const studentData = studentDocs.docs.map((doc) => doc.data());
        setUserlist(studentData);
    }

    // Fetch notifications
    const fetchNotifications = async () => {
        const notificationsSnapshot = await getDocs(collection(db, "notifications"));
        const notificationsList = notificationsSnapshot.docs.map(doc => {
            const data = doc.data();
            const isNew = (new Date() - data.createdAt.toDate()) < 7 * 24 * 60 * 60 * 1000; // Check if the notification is less than a week old
            return { ...data, isNew };
        });
        setNotifications(notificationsList);

    };

    useEffect(() => {
        async function fetchData() {
            await fetchStudents();
            await fetchNotifications();
            console.log(notifications);
        }
        fetchData();
    }, [])


    return (
        <>
            {/* Left Sidebar (Principal Message) */}
            <aside className="sidebar">
                <h3>Principal's Message</h3>
                <img
                    src="https://www.jecjabalpur.ac.in/images/principal_big_small_n.jpeg"
                    alt="Principal"
                />
                <p>
                    Dear Students,
                    <br /><br />
                    Welcome to <strong>Jabalpur Engineering College (JEC)</strong>! Since 1947, our institution has been a beacon of
                    <strong> academic excellence and innovation</strong>.
                    <br /><br />
                    I encourage you to <strong>dream big, stay curious, and work hard</strong>. Make the most of your time here—explore, innovate,
                    and contribute to society. Together, let’s build a future of <strong>excellence and progress</strong>.
                    <br /><br />
                    Wishing you success in all your endeavors!
                </p>
                <h4>Prof. [Your Principal’s Name]</h4>
                <p><em>Principal, Jabalpur Engineering College</em></p>
            </aside>

            {/* Important Notices Section */}
            <main>
                <h2>Important Notices</h2>
                <div className="notice-box">
                    <ul>
                        {notifications.map((notification, index) => (
                            <li key={index}>
                                <strong>{notification.title}</strong>
                                <p>{notification.description}</p>
                                <p className="uploaded-by">Uploaded by:<strong>{notification.uploadBy} sir</strong> </p>

                                {notification.isNew && <span className="new-label">New</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            </main>

            {/* Login Section */}
            <aside className="login-corner">
                <h2 id="login-title" className={role ? "fade-slide" : "hidden"}>
                    {role ? `Login as ${role}` : "Login as Guest"}
                </h2>
                <form onSubmit={
                    role === "HOD" ? handleHodLogin :
                        role === "PROJECTHEAD" ? handleProjectHeadLogin :
                            role === "STUDENT" ? handleStudentLogin : null
                }
                >
                    <label htmlFor="role">Select Role:</label>
                    <select id="role" name="role" onChange={(e) => { setRole(e.target.value) }} className="animate-dropdown">
                        <option value="">Select</option>
                        <option value="HOD">HOD</option>
                        <option value="PROJECTHEAD">PROJECT HEAD</option>
                        <option value="STUDENT">STUDENT</option>
                    </select>

                    <label htmlFor="userid">Email:</label>
                    <input type="text" id="userid" name="userid"
                        onChange={(e) => {
                            role === "HOD" ? setHodEmail(e.target.value) :
                                role === "PROJECTHEAD" ? setProjectHeadEmail(e.target.value) :
                                    role === "STUDENT" ? setEmail(e.target.value) : null
                        }}
                        placeholder="Enter your Email" required className="animated-input" />

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password"
                        onChange={(e) => {
                            role === "HOD" ? setHodPassword(e.target.value) :
                                role === "PROJECTHEAD" ? setProjectHeadPassword(e.target.value) :
                                    role === "STUDENT" ? setPassword(e.target.value) : null
                        }}
                        placeholder="Enter your password" required className="animated-input" />

                    <button type="submit" className="animated-button">Login</button>
                </form>

                <div className="extra-links">
                    <Link to='/signup'>Not have an account? Signup</Link>
                    <a href="#">Forgot password?</a>
                </div>
            </aside>

            {/* footer */}
            <footer className="footer">
                <p>&copy; {new Date().getFullYear()} Jabalpur Engineering College. All rights reserved.</p>
                <p>
                    <a href="https://www.jecjabalpur.ac.in" target="_blank" rel="noopener noreferrer">Visit our main website</a>
                </p>
            </footer>
        </>
    );
};

export default Home;