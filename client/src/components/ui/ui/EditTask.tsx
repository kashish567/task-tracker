import { useState, useEffect } from "react";
import axios from "axios"; // Import Axios
import createTsk from "../../../../public/add-task.png"; // Adjust this import according to your assets folder structure.
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom"; // React Router for navigation and params

const EditTask = () => {
  const history = useNavigate();
  const { taskId } = useParams(); // Extracting taskId from the URL

  const [task, setTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    status: "To Do", // Default value
    assignedUser: "",
    priority: "Medium", // Default value
    createdBy: "", // Optional field
  });

  // Axios configuration
  const apiURL = "https://task-tracker-1-08v5.onrender.com/api/tasks/"; // Replace with your actual API endpoint

  // Fetch task details using taskId when component mounts
  useEffect(() => {
    const fetchTaskDetails = async () => {
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

        const response = await axios.get(`${apiURL}/${taskId}`, config);
        setTask(response.data); // Populate the state with fetched task details
      } catch (error: any) {
        console.error("Error fetching task details:", error.response?.data || error.message);
        toast.error("Failed to fetch task details!", { position: "top-right" });
      }
    };

    fetchTaskDetails();
  }, [taskId, apiURL]);

  const handleUpdateTask = async (event: React.FormEvent) => {
    event.preventDefault();

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

      // Update Task using PUT request
      await axios.put(`${apiURL}/${taskId}`, task, config);
      toast.success("Your task is updated!", { position: "top-right" });

      // Navigate to task view page
      history("/view-task");
    } catch (error: any) {
      console.error("Error updating task:", error.response?.data || error.message);
      toast.error("Failed to update your task!", { position: "top-right" });
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
          <img src={createTsk} style={{ width: "30%" }} alt="Edit task" />
        </div>

        <h1 className="text-3xl text-center font-semibold text-black">
          Edit your task here!
        </h1>
        <form onSubmit={handleUpdateTask}>
          {/* Task Title */}
          <div className="mt-5">
            <label
              htmlFor="task_title"
              className="block mb-2 font-semibold text-black"
            >
              TITLE
            </label>
            <input
              type="text"
              id="task_title"
              className="w-full p-2 text-black font-semibold bg-white border border-gray-700 rounded-lg"
              name="task_title"
              onChange={(event) =>
                setTask({ ...task, title: event.target.value })
              }
              value={task.title}
            />
          </div>

          {/* Task Description */}
          <div className="mt-4">
            <label
              htmlFor="task_description"
              className="block mb-2 font-semibold text-black"
            >
              DESCRIPTION
            </label>
            <textarea
              id="task_description"
              rows={4}
              className="w-full p-2 text-black font-semibold bg-white border border-gray-700 rounded-md"
              name="task_description"
              onChange={(event) =>
                setTask({ ...task, description: event.target.value })
              }
              value={task.description}
            />
          </div>

          {/* Task Due Date */}
          <div className="mt-4">
            <label
              htmlFor="task_dueDate"
              className="block mb-2 font-semibold text-black"
            >
              DUE DATE
            </label>
            <input
              type="date"
              id="task_dueDate"
              className="w-full p-2 text-black font-semibold bg-white border border-gray-700 rounded-lg"
              name="task_dueDate"
              onChange={(event) =>
                setTask({ ...task, dueDate: event.target.value })
              }
              value={task.dueDate}
            />
          </div>

          {/* Task Status */}
          <div className="mt-4">
            <label
              htmlFor="task_status"
              className="block mb-2 font-semibold text-black"
            >
              STATUS
            </label>
            <select
              id="task_status"
              className="w-full p-2 text-black font-semibold bg-white border border-gray-700 rounded-md"
              name="task_status"
              onChange={(event) =>
                setTask({ ...task, status: event.target.value })
              }
              value={task.status}
            >
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Task Priority */}
          <div className="mt-4">
            <label
              htmlFor="task_priority"
              className="block mb-2 font-semibold text-black"
            >
              PRIORITY
            </label>
            <select
              id="task_priority"
              className="w-full p-2 text-black font-semibold bg-white border border-gray-700 rounded-md"
              name="task_priority"
              onChange={(event) =>
                setTask({ ...task, priority: event.target.value })
              }
              value={task.priority}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Assigned User */}
          <div className="mt-4">
            <label
              htmlFor="task_assignedUser"
              className="block mb-2 font-semibold text-black"
            >
              ASSIGNED USER (ID)
            </label>
            <input
              type="text"
              id="task_assignedUser"
              className="w-full p-2 text-black font-semibold bg-white border border-gray-700 rounded-lg"
              name="task_assignedUser"
              onChange={(event) =>
                setTask({ ...task, assignedUser: event.target.value })
              }
              value={task.assignedUser}
            />
          </div>

          {/* Buttons */}
          <div className="mt-8">
            <button className="bg-green-600 py-2 px-3 rounded-lg text-white font-bold hover:bg-transparent hover:border-2 hover:border-green-600 mr-4">
              Update
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="bg-red-600 text-white py-2 px-3 rounded-lg font-bold hover:bg-transparent hover:border-2 hover:border-red-600"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTask;
