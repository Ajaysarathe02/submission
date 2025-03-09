import React, { useEffect, useState, useContext } from "react";
import "./ProjectheadDash.css"; // Importing the CSS file for styling
import { getDocs, getDoc, doc, collection, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";
import { signOut } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../../firebase/UserContext";

const ProjectHeadDashboard = () => {
  const { currentUser } = useContext(UserContext);
  const [projectHeadDetails, setProjectHeadDetails] = useState({});
  const [hodProjects, setHodProjects] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [reviewMessage, setReviewMessage] = useState("");
  const [expandedProject, setExpandedProject] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || {};

  const fetchProjectHeadData = async (user) => {
    const projectHeadSnapshot = await getDoc(doc(db, "project-heads", user.uid));
    setProjectHeadDetails(projectHeadSnapshot.data());
  };

  //   // fetch user details through user id
    const fetchUserDetails = async (userId) => {
      const userDoc = await getDoc(doc(db, "students", userId));
      return userDoc.data();
    };

  const fetchHodProjects = async () => {
      const projectsSnapshot = await getDocs(collection(db, "projects"));
      const projectsList = await Promise.all(projectsSnapshot.docs.map(async (doc) => {
        const project = doc.data();
        project.submittedBy = await fetchUserDetails(project.submittedBy);
        return project
      }
      ));
      setHodProjects(projectsList);
    };

  useEffect(() => {
    if (currentUser) {
      fetchProjectHeadData(currentUser);
      fetchHodProjects();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      fetchHodProjects();
    }
  }, [hodProjects]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out: " + error.message);
    }
  };

  const handleReviewClick = (project) => {
    setSelectedProject(project);
    setIsReviewModalOpen(true);
  };

  const handleAssignProject = async () => {
    try {
      const projectRef = doc(db, "projects", selectedProject.id);
      await updateDoc(projectRef, {
        assignedTo: "HOD",
        reviewMessage: reviewMessage,
      });
      toast.success("Project assigned to HOD successfully!", { position: "top-center" });
      setIsReviewModalOpen(false);
    } catch (error) {
      console.error("Error assigning project:", error);
      alert("Error assigning project: " + error.message);
    }
  };

  const handleAcceptProject = async (project) => {
    console.log(project)
    try {
      const projectRef = doc(db, "projects", project.id);
      await updateDoc(projectRef, {
        proHeadStatus:"approved"
      });

      // Update the project status in the student's specific project document
      const studentProjectRef = doc(db, "students", project.uid, "projects", project.id);
      await updateDoc(studentProjectRef, {
        proHeadStatus:"approved"
      });

      toast.success("Project accepted successfully by project head!", { position: "top-center" });
    } catch (error) {
      console.error("Error accepting project:", error);
      alert("Error accepting project: " + error.message);
    }

    
  };

  const handleRejectProject = async (project) => {
    try {
      const projectRef = doc(db, "projects", project.id);
      await updateDoc(projectRef, {
        status: "Rejected",
      });
      toast.success("Project rejected successfully!", { position: "top-center" });
    } catch (error) {
      console.error("Error rejecting project:", error);
      alert("Error rejecting project: " + error.message);
    }
  };

  const toggleExpandProject = (index) => {
    setExpandedProject(expandedProject === index ? null : index);
  };

  return (
    <div className="dashboard-container">
      <div className="left-panel">
        <h2 className="text-blue-950 font-bold text-[18px]">Project Head Dashboard</h2>
        <div className="student-details">
          <h3>Project Head Details</h3>
          <p><strong>Name:</strong> {projectHeadDetails.Name}</p>
          <p><strong>Project:</strong> {projectHeadDetails.Department}</p>
          <p><strong>Designation:</strong> {projectHeadDetails.Designation}</p>
          <p><strong>Email:</strong> {projectHeadDetails.Email}</p>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <div className="right-panel">
        <div className="project-list">
          <h3>Submitted Projects by students</h3>
          <div className="project-row">
            {hodProjects.map((project, index) => (
              <div key={index} className="project-item">
                <p className="flex">submitted by : <h4 className="text-blue-800 font-bold">{project.submittedBy.Name} </h4> </p>
                <div className="project-summary" onClick={() => toggleExpandProject(index)}>
                  <h4>{project.projectTitle}</h4>
                  <p><strong>Group ID:</strong> {project.groupId}</p>
                </div>
                {expandedProject === index && (
                  <div className="project-details">
                    <p><strong>Description:</strong> {project.description}</p>
                    {project.fileName && <p><strong>File:</strong> {project.fileName}</p>}
                    {project.githubLink && <p><strong>GitHub Link:</strong> <a href={project.githubLink} target="_blank" rel="noopener noreferrer">{project.githubLink}</a></p>}
                    {project.fileUrl && <p><strong>File url :</strong><a href={project.fileUrl}>Download</a></p>}
                    <button onClick={() => handleReviewClick(project)} className="review-button">Review</button>
                    <button onClick={() => handleAcceptProject(project)} className="accept-button">Accept</button>
                    <button onClick={() => handleRejectProject(project)} className="reject-button">Reject</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {isReviewModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setIsReviewModalOpen(false)}>&times;</span>
            <h3>Review Project</h3>
            <p><strong>Project Title:</strong> {selectedProject.projectTitle}</p>
            <p><strong>Submitted By:</strong> {selectedProject.studentName}</p>
            <textarea
              placeholder="Message to student"
              value={reviewMessage}
              onChange={(e) => setReviewMessage(e.target.value)}
              className="review-message-input"
            ></textarea>
            <button onClick={handleAssignProject} className="assign-button">Assign to HOD</button>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectHeadDashboard;