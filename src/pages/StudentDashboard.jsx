import React, { useEffect, useState, useContext } from "react";
// import "./StudentDashboard.css"; 
import "./student.css";
import { getDocs, getDoc, doc, collection, addDoc, deleteDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import { signOut } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../firebase/UserContext";
import { supabase } from "../supabase/supabaseClient";

const StudentDashboard = () => {
  const { currentUser } = useContext(UserContext);
  const [studentDetails, setStudentDetails] = useState({});
  const [projectSubByStudent, setProjectSubByStudent] = useState([]);
  const [groupId, setGroupId] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [githubLink, setGithubLink] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [expandedProject, setExpandedProject] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = location.state || {};

  const fetchStudentsData = async (user) => {
    const studentData = await getDoc(doc(db, "students", user.uid));
    setStudentDetails(studentData.data());
  };

  const fetchProjects = async (user) => {
    const projectsSnapshot = await getDocs(collection(db, "students", user.uid, "projects"));
    const projectsList = projectsSnapshot.docs.map(doc => doc.data());
    setProjects(projectsList);
  };

  useEffect(() => {

    auth.onAuthStateChanged(async (user) => {
      if (user && role === "STUDENT") {
        await fetchStudentsData(user);
        await fetchProjects(user);
      }
    });
  }, [role]);

  useEffect(() => {

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        await fetchProjects(user);
      }
    });
  }, [projects]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // generate random id
  const generateRandomId = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const handleStudentSubmitProject = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;

      // Upload file to Supabase
      let fileUrl = "";
    
      if (file) {
        const { data, error } = await supabase.storage
          .from('submission')
          .upload(`public/${file.name}`, file);
                

        if (error) {
          console.error('Error uploading file:', error);
          alert('Error uploading file');
          return;
        } else {
          toast.success("File uploaded successfully", { position: 'top-center' });
          const { data: urlData } = await supabase.storage
            .from('submission')
            .getPublicUrl(`public/${file.name}`);
          fileUrl = urlData.publicUrl;
        }
      }

      const projectId = generateRandomId()

      const projectData = {
        id:projectId,
        uid:user.uid,
        groupId,
        projectTitle,
        description,
        githubLink,
        fileName: file ? file.name : null,
        fileUrl: fileUrl,
        submittedBy: user.uid,
        submittedAt: new Date(),
        hodStatus:"not approved",
        proHeadStatus:"not approved"
      };

      await setDoc(doc(db, "students", user.uid, "projects",projectId), projectData).then(
        () => { toast.success("Project under submitted successfully!", { position: "top-center" }) });


        await setDoc(doc(db, "projects",projectId), projectData).then(() => {
        toast.success("Project over submitted successfully!", { position: "top-center" });
      });

      setIsModalOpen(false); // Close the modal after submission
      await fetchProjects(user); // Fetch the updated list of projects
    } catch (error) {
      console.error("Error submitting project:", error);
      alert("Error submitting project: " + error.message);
    }
  };

  const toggleExpandProject = (index) => {
    setExpandedProject(expandedProject === index ? null : index);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const user = auth.currentUser;
      await deleteDoc(doc(db, "students", user.uid, "projects", projectId));
      await deleteDoc(doc(db, "projects", projectId));
      toast.success(`${projectId} Project deleted successfully!`, { position: "top-center" });

      await fetchProjects(user); // Fetch the updated list of projects
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Error deleting project: " + error.message);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="left-panel">
        <h2 className="text-blue-950 font-bold text-[18px]">Student Dashboard</h2>
        <div className="student-details">
          <h3>Student Details</h3>
          <p><strong>Name:</strong> {studentDetails.Name}</p>
          <p><strong>Roll Number:</strong> {studentDetails.RollNumber}</p>
          <p><strong>Branch:</strong> {studentDetails.Branch}</p>
          <p><strong>Email:</strong> {studentDetails.Email}</p>
        </div>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <div className="right-panel">
        <h3>Project Submission</h3>
        <button onClick={() => setIsModalOpen(true)} className="add-project-button">Add Project</button>
        {isModalOpen && (
          <div className={`modal ${isModalOpen ? 'open' : ''}`}>

            <div className="modal-content">

              <span className="close-button" onClick={() => setIsModalOpen(false)}>&times;</span>
              <form onSubmit={handleStudentSubmitProject} className="project-form">
                <label htmlFor="groupId">Group ID:</label>
                <input
                  type="text"
                  id="groupId"
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  required
                />
                <label htmlFor="projectTitle">Project Title:</label>
                <input
                  type="text"
                  id="projectTitle"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  required
                />
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
                <label htmlFor="file">Upload File:</label>
                <input
                className="text-amber-400"
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="githubLink">GitHub Link:</label>
                <input
                  type="url"
                  id="githubLink"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                />
                <button type="submit" className="submit-button">Submit Project</button>
              </form>
            </div>
          </div>
        )}

        <div className="project-list">
          <h3>Submitted Projects</h3>
          <div className="project-row">
            {projects.map((project, index) => (
              <div key={index} className="project-item">
                <div className="project-summary" onClick={() => toggleExpandProject(index)}>
                  <h4>{project.projectTitle}</h4>
                  <p><strong>Group ID:</strong> {project.groupId}</p>
                </div>
                {expandedProject === index && (
                  <div className="project-details">
                    <p><strong>Description:</strong> {project.description}</p>
                    {project.fileName && <p><strong>File Name:</strong> {project.fileName}</p>}
                    {project.githubLink && <p><strong>GitHub Link:</strong> <a href={project.githubLink} target="_blank" rel="noopener noreferrer">{project.githubLink}</a></p>}
                    {project.fileUrl && <p><strong>File Link:</strong> <a href={project.fileUrl}>Download</a></p>}

                    <p><strong>Status of Hod : </strong>
                    <span className={project.hodStatus === "approved" ? "text-green-600" : "text-red-600"}>{project.hodStatus}</span></p>
                    <p><strong>Status of Project Head : </strong>

                    <span className={project.proHeadStatus === "approved" ? "text-green-600" : "text-red-600"}>{project.proHeadStatus}</span></p>
                    <button onClick={() => handleDeleteProject(project.id)} className="delete-button">Delete Project</button>
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

export default StudentDashboard;