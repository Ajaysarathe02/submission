import React, { useState } from "react";
import "./Signup.css"; // Importing the CSS file for styling
import { Link } from "react-router-dom";
import { auth, db } from "../firebase/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const Signup = () => {
  const [role, setRole] = useState(""); // State to track selected role

  // Student Signup Form State
  const [studentName, setStudentName] = useState("");
  const [studentRoll, setStudentRoll] = useState("");
  const [studentBranch, setStudentBranch] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  // HOD Signup Form State
  const [hodName, setHodName] = useState("");
  const [hodDepartment, setHodDepartment] = useState("");
  const [hodDesignation, setHodDesignation] = useState("");
  const [hodEmail, setHodEmail] = useState("");
  const [hodPassword, setHodPassword] = useState("");

   // Project Head Signup Form State
   const [phName, setPhName] = useState("");
   const [phDepartment, setPhDepartment] = useState("");
   const [phDesignation, setPhDesignation] = useState("");
   const [phEmail, setPhEmail] = useState("");
   const [phPassword, setPhPassword] = useState("");


   // student signup function
const handleStudentSignup = async (event) => {
  event.preventDefault();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, studentEmail, studentPassword);
    const user = userCredential.user;
    console.log(user);

   await setDoc(doc(db, "students", user.uid), {
    Name: studentName,
    RollNumber: studentRoll,
    Branch: studentBranch,
    Email: studentEmail,
    Role: role
  });

  } catch (error) {
    console.error("Error signing up:", error);
    toast.error("Error signing up: " + error.message,{position: "top-center"});
  }
}

// HOD signup function
const handleHodSignup = async (event) => {
  console.log(hodName, hodDepartment, hodDesignation, hodEmail, hodPassword);
  event.preventDefault();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, hodEmail, hodPassword);
    const user = userCredential.user;
    console.log(user);

    await setDoc(doc(db, "hods", user.uid), {
      Name: hodName,
      Department: hodDepartment,
      Designation: hodDesignation,
      Email: hodEmail,
      Role: role
    }).then(() => {
      console.log("Document successfully written!");
      toast.success("User signed up successfully", { position: "top-center" });
    });

  } catch (error) {
    console.error("Error signing up:", error);
    toast.error("Error signing up: " + error.message, { position: "top-center" });
  }
};

// Project Head signup function
const handleProjectHeadSignup = async (event) => {
  event.preventDefault();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, phEmail, phPassword);
    const user = userCredential.user;
    console.log(user);

    await setDoc(doc(db, "project-heads", user.uid), {
      Name: phName,
      Department: phDepartment,
      Designation: phDesignation,
      Email: phEmail,
      Role: role
    }).then(() => {
      toast.success("Project Head signed up successfully!", { position: "top-center" });
    }
    );

    
  } catch (error) {
    console.error("Error signing up:", error);
    toast.error("Error signing up: " + error.message, { position: "top-center" });
  }
};

return (
  <div className="signup-body">
    <div className="signup-container">
      <h2>Signup</h2>
      <p>Select your role and fill out the form</p>

      {/* Role Selection Dropdown */}
      <label htmlFor="role">Select Role:</label>
      <select id="role" value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">Select Role</option>
        <option value="student">Student</option>
        <option value="hod">HOD</option>
        <option value="project-head">Project Head</option>
      </select>

      {/* Student Signup Form */}
      {role === "student" && (
        <form className="signup-form fade-in" onSubmit={handleStudentSignup}>
          <h3>Student Signup</h3>
          <label htmlFor="student-name">Full Name:</label>
          <input type="text" id="student-name" placeholder="Enter your full name" onChange={(e)=>{setStudentName(e.target.value)}} required />

          <label htmlFor="student-roll">Roll Number:</label>
          <input type="text" id="student-roll" placeholder="Enter your roll number" onChange={(e)=>{setStudentRoll(e.target.value)}} required />

          <label htmlFor="student-branch">Branch:</label>
          <select id="student-branch" onChange={(e)=>{setStudentBranch(e.target.value)}}>
            <option value="">Select Branch</option>
            <option value="cse">Computer Science</option>
            <option value="ece">Electronics</option>
            <option value="mech">Mechanical</option>
            <option value="civil">Civil</option>
          </select>

          <label htmlFor="student-email">Email:</label>
          <input type="email" id="student-email" placeholder="Enter your email" onChange={(e)=>{setStudentEmail(e.target.value)}} required />

          <label htmlFor="student-password">Password:</label>
          <input type="password" id="student-password" placeholder="Create a password" onChange={(e)=>{setStudentPassword(e.target.value)}} required />

          <button  className="sign-up-stu" type="submit">Signup</button>
        </form>
      )}

      {/* HOD Signup Form */}
      {role === "hod" && (
        <form className="signup-form fade-in" onSubmit={handleHodSignup}>
          <h3>HOD Signup</h3>
          <label htmlFor="hod-name">Full Name:</label>
          <input type="text" id="hod-name" placeholder="Enter your full name" onChange={(e)=>{setHodName(e.target.value)}} required />

          <label htmlFor="hod-department">Department:</label>
          <select id="hod-department" onChange={(e)=>{setHodDepartment(e.target.value)}}>
            <option value="">Select Department</option>
            <option value="cse">Computer Science</option>
            <option value="ece">Electronics</option>
            <option value="mech">Mechanical</option>
            <option value="civil">Civil</option>
          </select>

          <label htmlFor="hod-department">Designation:</label>
          <select id="hod-department" onChange={(e)=>{setHodDesignation(e.target.value)}}>
            <option value="">Select Designation</option>
            <option value="professor">Professor</option>
            <option value="asst-professor">Asst Professor</option>
            <option value="ass-professor">Associate Professor</option>
            <option value="asst-lecturer">Asst Lecturer</option>
          </select>

          <label htmlFor="hod-email">Email:</label>
          <input type="email" id="hod-email" placeholder="Enter your email" onChange={(e)=>{setHodEmail(e.target.value)}} required />

          <label htmlFor="hod-password">Password:</label>
          <input type="password" id="hod-password" placeholder="Create a password" onChange={(e)=>{setHodPassword(e.target.value)}} required />

          <button className="sign-up-hod" type="submit">Signup</button>
        </form>
      )}

      {/* Project Head Signup Form */}
      {role === "project-head" && (
        <form className="signup-form fade-in" onSubmit={handleProjectHeadSignup}>
          <h3>Project Head Signup</h3>
          <label htmlFor="ph-name">Full Name:</label>
          <input type="text" id="ph-name" placeholder="Enter your full name" onChange={(e)=>{setPhName(e.target.value)}} required />

          <label htmlFor="hod-department">Department:</label>
          <select id="hod-department" onChange={(e)=>{setPhDepartment(e.target.value)}}>
            <option value="">Select Department</option>
            <option value="cse">Computer Science</option>
            <option value="ece">Electronics</option>
            <option value="mech">Mechanical</option>
            <option value="civil">Civil</option>
          </select>

          <label htmlFor="hod-department">Designation:</label>
          <select id="hod-department" onChange={(e)=>{setPhDesignation(e.target.value)}}>
            <option value="">Select Designation</option>
            <option value="professor">Professor</option>
            <option value="asst-professor">Asst Professor</option>
            <option value="ass-professor">Associate Professor</option>
            <option value="asst-lecturer">Asst Lecturer</option>
          </select>

          <label htmlFor="ph-email">Email:</label>
          <input type="email" id="ph-email" placeholder="Enter your email" onChange={(e)=>{setPhEmail(e.target.value)}} required />

          <label htmlFor="ph-password">Password:</label>
          <input type="password" id="ph-password" placeholder="Create a password" onChange={(e)=>{setPhPassword(e.target.value)}} required />

          <button className="sign-up-pro-head" type="submit">Signup</button>
        </form>
      )}

      <Link to="/" className="already-login">Already have an account? Login</Link>
    </div>
  </div>
);

};

export default Signup;
