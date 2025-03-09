import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup"; // Make sure you have a Signup component
import Layout from './pages/Layout'
import Home from './pages/Home'
import Dashboard from "./pages/Dashboard";
import ProjectSubmission from "./pages/ProjectSubmission";
import NoticeBoard from "./pages/NoticeBoard";
import StudentDashboard from "./pages/StudentDashboard";
import Login from "./pages/Login";
import { ToastContainer } from "react-toastify";
import AdminList from "./pages/AdminList";
import { UserProvider } from "./firebase/UserContext";
import Uploadex from "./supabase/Uploadex";
import ProjectHeadDashboard from "./pages/projecthead/ProjectHeadDashboard";
import HodDashboard from "./pages/hod/HodDashboard";

const App = () => {
  return (
    <userProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
          <Route path="signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/submit-project" element={<ProjectSubmission />} />
          <Route path="/notice-board" element={<NoticeBoard />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/admin-list" element={<AdminList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/uploadex" element={<Uploadex />} />
          <Route path="/projecthead-dash" element={<ProjectHeadDashboard/>} />
          <Route path="/hod-dash" element={<HodDashboard/>} />
        </Route>
      </Routes>
      <ToastContainer />
    </Router>
    </userProvider>
  );
};

export default App;