import { useState, useEffect } from "react";
import axios from "axios";
import createTsk from "../../../../public/add-task.png";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const AddTask = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const userRole = useSelector((state: any) => state.user.user.role);

  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "To Do",
    assignedUser: "",
    priority: "Medium",
    createdBy: "", // to be set upon form submission
  });

  const [users, setUsers] = useState([]); // State to store all users for dropdown
  const apiURL = "https://task-tracker-1-08v5.onrender.com/api/tasks/";

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get("https://task-tracker-1-08v5.onrender.com/api/auth/get-all-user", config);
        console.log(response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users!", { position: "top-right" });
      }
    };

    if (userRole === "Admin") {
      fetchUsers();
    }
  }, [userRole]);

  const handleAddTask = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!task.title) {
      toast.error("Title is required", { position: "top-right" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authorization token found", { position: "top-right" });
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      if (taskId) {
        await axios.put(
          `${apiURL}/${taskId}`,
          { ...task, createdBy: userRole === "Admin" ? task.assignedUser : "" },
          config
        );
        toast.success("Your task is updated!", { position: "top-right" });
      } else {
        await axios.post(
          apiURL,
          { ...task, createdBy: localStorage.getItem("userId") },
          config
        );
        toast.success("Your task is added successfully!", {
          position: "top-right",
        });
      }

      setTask({
        title: "",
        description: "",
        dueDate: "",
        status: "To Do",
        assignedUser: "",
        priority: "Medium",
        createdBy: "",
      });

      navigate("/view-task");
    } catch (error: any) {
      console.error("Error adding/updating task:", error.response?.data || error.message);
      toast.error("Failed to add/update your task!", { position: "top-right" });
    }
  };

  const handleClear = (event: React.MouseEvent) => {
    event.preventDefault();
    setTask({
      title: "",
      description: "",
      dueDate: "",
      status: "To Do",
      assignedUser: "",
      priority: "Medium",
      createdBy: "",
    });
  };

  return (
    <div className="grid grid-cols-12 mt-2 justify-center">
      <div className="col-span-4 col-start-5 p-5 shadow-sm">
        <div className="mb-3 flex justify-center">
          <img src={createTsk} style={{ width: "30%" }} alt="Create task" />
        </div>
        <h1 className="text-3xl text-center font-semibold text-black">
          Create your task here!
        </h1>
        <form onSubmit={handleAddTask}>
          <div className="mt-5">
            <label htmlFor="task_title" className="block mb-2 font-semibold text-black">
              TITLE
            </label>
            <input
              type="text"
              id="task_title"
              className="w-full p-2 text-black font-semibold bg-white border border-gray-700 rounded-lg"
              name="task_title"
              onChange={(event) => setTask({ ...task, title: event.target.value })}
              value={task.title}
              required
            />
          </div>
          <div className="mt-4">
            <label htmlFor="task_description" className="block mb-2 font-semibold text-black">
              DESCRIPTION
            </label>
            <textarea
              id="task_description"
              rows={4}
              className="w-full p-2 text-black font-semibold bg-white border border-gray-700 rounded-md"
              name="task_description"
              onChange={(event) => setTask({ ...task, description: event.target.value })}
              value={task.description}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="task_dueDate" className="block mb-2 font-semibold text-black">
              DUE DATE
            </label>
            <input
              type="date"
              id="task_dueDate"
              className="w-full p-2 text-black font-semibold bg-white border border-gray-700 rounded-lg"
              name="task_dueDate"
              onChange={(event) => setTask({ ...task, dueDate: event.target.value })}
              value={task.dueDate}
            />
          </div>
          <div className="mt-4">
            <label htmlFor="task_status" className="block mb-2 font-semibold text-black">
              STATUS
            </label>
            <select
              id="task_status"
              className="w-full p-2 text-black font-semibold bg-white border border-gray-700 rounded-lg"
              onChange={(event) => setTask({ ...task, status: event.target.value })}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <div className="mt-4">
            <label htmlFor="task_priority" className="block mb-2 font-semibold text-black">
              PRIORITY
            </label>
            <select
              id="task_priority"
              className="w-full p-2 text-black font-semibold bg-white border border-gray-700 rounded-lg"
              onChange={(event) => setTask({ ...task, priority: event.target.value })}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Only show this section if the user is an Admin */}
          {userRole === "Admin" && (
            <div className="mt-4">
              <label htmlFor="task_assignedUser" className="block mb-2 font-semibold text-black">
                ASSIGNED USER
              </label>
              <select
                id="task_assignedUser"
                className="w-full p-2 text-black font-semibold bg-white border border-gray-700 rounded-lg"
                onChange={(event) => setTask({ ...task, assignedUser: event.target.value })}
                value={task.assignedUser}
              >
                <option value="">Select a User</option>
                {users.map((user: any) => (
                  <option key={user._id} value={user._id}>
                    {user.name} 
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={handleClear}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Clear
            </button>
            <button
              type="submit"
              className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
            >
              {taskId ? "Update" : "Add"} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
