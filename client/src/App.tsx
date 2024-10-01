// import { LogIn } from 'lucide-react'
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import HomePage from "./pages/HomePage";
import Navbar from "./components/ui/ui/Navbar";
import Createtask from "./components/ui/ui/Createtask";
import ViewTasks from "./components/ui/ui/Viewtask";
import EditTask from "./components/ui/ui/EditTask";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/" element={<Testcomponent />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/create-task" element={<Createtask />} />
          <Route path="/view-task" element={<ViewTasks />} />
          <Route path="/edit-task/:taskId" element={<EditTask />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
