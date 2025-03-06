import { useState } from "react";

const ProjectSubmission = () => {
  const [projectTitle, setProjectTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ projectTitle, description });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Project Submission</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input type="text" placeholder="Project Title" className="p-2 border" onChange={(e) => setProjectTitle(e.target.value)} />
        <textarea placeholder="Description" className="p-2 border" onChange={(e) => setDescription(e.target.value)}></textarea>
        <button type="submit" className="bg-blue-600 text-white p-2">Submit</button>
      </form>
    </div>
  );
};

export default ProjectSubmission;
