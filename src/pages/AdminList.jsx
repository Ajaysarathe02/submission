import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "./AdminList.css"; // Importing the CSS file for styling

const AdminList = () => {
  const [students, setStudents] = useState([]);
  const [hods, setHods] = useState([]);
  const [projectHeads, setProjectHeads] = useState([]);
  const [expandedStudents, setExpandedStudents] = useState([]);
  const [expandedHods, setExpandedHods] = useState([]);
  const [expandedProjectHeads, setExpandedProjectHeads] = useState([]);

  // Fetch students data
  const fetchStudents = async () => {
    const studentsSnapshot = await getDocs(collection(db, "students"));
    const studentsList = studentsSnapshot.docs.map(doc => doc.data());
    setStudents(studentsList);
  };

  // Fetch HODs data
  const fetchHods = async () => {
    const hodsSnapshot = await getDocs(collection(db, "hods"));
    const hodsList = hodsSnapshot.docs.map(doc => doc.data());
    setHods(hodsList);
  };

  // Fetch Project Heads data
  const fetchProjectHeads = async () => {
    const projectHeadsSnapshot = await getDocs(collection(db, "project-heads"));
    const projectHeadsList = projectHeadsSnapshot.docs.map(doc => doc.data());
    setProjectHeads(projectHeadsList);
  };

  useEffect(() => {
    fetchStudents();
    fetchHods();
    fetchProjectHeads();
  }, []);

  const toggleExpandStudent = (index) => {
    setExpandedStudents(expandedStudents.includes(index)
      ? expandedStudents.filter(i => i !== index)
      : [...expandedStudents, index]);
  };

  const toggleExpandHod = (index) => {
    setExpandedHods(expandedHods.includes(index)
      ? expandedHods.filter(i => i !== index)
      : [...expandedHods, index]);
  };

  const toggleExpandProjectHead = (index) => {
    setExpandedProjectHeads(expandedProjectHeads.includes(index)
      ? expandedProjectHeads.filter(i => i !== index)
      : [...expandedProjectHeads, index]);
  };

  return (
    <div className="admin-list-container">
      <h2 className="admin-list-header">Admin List</h2>

      <div className="user-lists">
        <div className="user-list">
          <h3>Students</h3>
          <ul>
            {students.map((student, index) => (
              <li key={index} className={expandedStudents.includes(index) ? 'expanded' : ''}>
                <p onClick={() => toggleExpandStudent(index)} className="user-name">
                  <strong>{student.Name}</strong>
                  <button className="toggle-button">
                    {expandedStudents.includes(index) ? '-' : '+'}
                  </button>
                </p>
                {expandedStudents.includes(index) && (
                  <div className="user-details">
                    <p><strong>Roll Number:</strong> {student.RollNumber}</p>
                    <p><strong>Branch:</strong> {student.Branch}</p>
                    <p><strong>Email:</strong> {student.Email}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="user-list">
          <h3>HODs</h3>
          <ul>
            {hods.map((hod, index) => (
              <li key={index} className={expandedHods.includes(index) ? 'expanded' : ''}>
                <p onClick={() => toggleExpandHod(index)} className="user-name">
                  <strong>{hod.Name}</strong>
                  <button className="toggle-button">
                    {expandedHods.includes(index) ? '-' : '+'}
                  </button>
                </p>
                {expandedHods.includes(index) && (
                  <div className="user-details">
                    <p><strong>Department:</strong> {hod.Department}</p>
                    <p><strong>Designation:</strong> {hod.Designation}</p>
                    <p><strong>Email:</strong> {hod.Email}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="user-list">
          <h3>Project Heads</h3>
          <ul>
            {projectHeads.map((projectHead, index) => (
              <li key={index} className={expandedProjectHeads.includes(index) ? 'expanded' : ''}>
                <p onClick={() => toggleExpandProjectHead(index)} className="user-name">
                  <strong>{projectHead.Name}</strong>
                  <button className="toggle-button">
                    {expandedProjectHeads.includes(index) ? '-' : '+'}
                  </button>
                </p>
                {expandedProjectHeads.includes(index) && (
                  <div className="user-details">
                    <p><strong>Project:</strong> {projectHead.Department}</p>
                    <p><strong>Designation:</strong> {projectHead.Designation}</p>
                    <p><strong>Email:</strong> {projectHead.Email}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminList;