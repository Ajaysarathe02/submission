
const NoticeBoard = () => {
    const projects = [
      { title: "AI-based Attendance System", submittedBy: "John Doe" },
      { title: "Blockchain Voting System", submittedBy: "Jane Smith" },
    ];
  
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Notice Board</h1>
        <ul className="mt-2">
          {projects.map((project, index) => (
            <li key={index} className="p-2 border">
              <strong>{project.title}</strong> - Submitted by {project.submittedBy}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default NoticeBoard;
  