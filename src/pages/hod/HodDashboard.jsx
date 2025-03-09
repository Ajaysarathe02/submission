import React, { useEffect, useState, useContext } from "react";
import "../StudentDashboard.css"; // Importing the CSS file for styling
import { getDocs, getDoc, doc,addDoc, collection, updateDoc } from "firebase/firestore";
import { db, auth } from "../../firebase/firebase";
import { signOut } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../../firebase/UserContext";

const HodDashboard = () => {
  const { currentUser } = useContext(UserContext);
  const [hodDetails, setHodDetails] = useState({});
  const [hodProjects, setHodProjects] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || {};

    const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationDescription, setNotificationDescription] = useState("");
  const [hodNotifications, setHodNotifications] = useState([]);
  const [isNotificationFormVisible, setIsNotificationFormVisible] = useState(false);

  const fetchHodData = async (user) => {
    const hodSnapshot = await getDoc(doc(db, "hods", user.uid));
    setHodDetails(hodSnapshot.data());
  };

  //   // fetch user details through user id
  const fetchUserDetails = async (userId) => {
    const userDoc = await getDoc(doc(db, "students", userId));
    return userDoc.data();
  };

  //   // fetch hod notifications
  const fetchHodNotifications = async (user) => {
    const notificationsSnapshot = await getDocs(collection(db, "hods", user.uid, "notifications"));
    const notificationsList = notificationsSnapshot.docs.map(doc => doc.data());
    setHodNotifications(notificationsList);
  };


  //   // notification submit for hod
  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    try {
      const notificationData = {
        title: notificationTitle,
        description: notificationDescription,
        createdAt: new Date(),
        createdBy: auth.currentUser.uid,
        uploadBy: hodDetails.Name,
      };

      await addDoc(collection(db, "notifications"), notificationData).then(() => {
        toast.success("Notification submitted successfully 1", { position: "top-center" });
      });

      await addDoc(collection(db, "hods", auth.currentUser.uid, "notifications"), notificationData).then(() => {
        toast.success("Notification submitted successfully 2 ", { position: "top-center" });
      });

      // Fetch the updated list of notifications
    } catch (error) {
      console.error("Error submitting notification:", error);
      alert("Error submitting notification: " + error.message);
    }
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
      fetchHodData(currentUser);
      fetchHodProjects();
      fetchHodNotifications(currentUser);

    }
  }, [currentUser]);

   useEffect(() => {
      if (currentUser) {
        fetchHodProjects();
      }
    }, [hodProjects]);

  useEffect(() => {
    if (currentUser) {
      fetchHodNotifications(currentUser);
    }
  }, [hodNotifications]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out: " + error.message);
    }
  };

  const toggleExpandProject = (index) => {
    setExpandedProject(expandedProject === index ? null : index);
  };

  const handleAcceptProject = async (project) => {
      console.log(project)
      try {
        const projectRef = doc(db, "projects", project.id);
        await updateDoc(projectRef, {
          hodStatus:"approved"
        });
  
        // Update the project status in the student's specific project document
        const studentProjectRef = doc(db, "students", project.uid, "projects", project.id);
        await updateDoc(studentProjectRef, {
          hodStatus:"approved"
        });
  
        toast.success("Project accepted successfully by hod!", { position: "top-center" });
      } catch (error) {
        console.error("Error accepting project:", error);
        alert("Error accepting project: " + error.message);
      }
  
      
    };

  return (
    <div className="dashboard-container">
      <div className="left-panel">
        <h2 className="text-blue-950 font-bold text-[18px]">Head of Department Dashboard</h2>
        <div className="student-details">
          <h3>HOD Details</h3>
          <p><strong>Name:</strong> {hodDetails.Name}</p>
          <p><strong>Department:</strong> {hodDetails.Department}</p>
          <p><strong>Designation:</strong> {hodDetails.Designation}</p>
          <p><strong>Email:</strong> {hodDetails.Email}</p>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
        {role === "HOD" && (
          <div className="notification-panel">
            <h3>Post a Notification</h3>

            <button onClick={() => setIsNotificationFormVisible(!isNotificationFormVisible)} className="toggle-notification-form-button">
              {isNotificationFormVisible ? "Hide Notification" : "Post Notification"}
            </button>
            <form onSubmit={handleNotificationSubmit} className={`notification-form ${isNotificationFormVisible ? 'expanded' : ''}`}>
              <label htmlFor="notificationTitle">Title:</label>
              <input
                type="text"
                id="notificationTitle"
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                required
              />
              <label htmlFor="notificationDescription">Description:</label>
              <textarea
                id="notificationDescription"
                value={notificationDescription}
                onChange={(e) => setNotificationDescription(e.target.value)}
                required
              ></textarea>
              <button type="submit" onClick={() => setIsNotificationFormVisible(!isNotificationFormVisible)} className="submit-button">Post Notification</button>
            </form>

            {/* Notification List */}
            <div className="notification-list">
              <h3>Notifications</h3>
              <ul>
                {hodNotifications.map((notification, index) => (
                  <li key={index}>
                    <strong>{notification.title}</strong>
                    <p>{notification.description}</p>
                    <p><em>{new Date(notification.createdAt.seconds * 1000).toLocaleString()}</em></p>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}
      </div>

      <div className="right-panel">
        <div className="project-list">
          <h3>Submitted Projects by students</h3>
          <div className="project-row">
            {hodProjects.map((project, index) => (
              <div key={index} className="project-item">
              
                <p className="flex">submitted by : <h4 className="text-blue-800 font-bold"> {project.submittedBy.Name} </h4> </p>
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
    </div>
  );
};

export default HodDashboard;