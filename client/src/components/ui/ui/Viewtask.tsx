import { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // For navigation
import { useSelector } from "react-redux"; // For accessing the Redux state
import axios from "axios"; // For API calls
import { toast } from "react-toastify"; // To show success or error messages

const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    priority: '',
    assignedUser: '',
  });
  const [search, setSearch] = useState('');

  // Get the user ID from Redux store
  const userId = useSelector((state) => state.user.user._id);

  // Fetch tasks from the backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("No authorization token found", {
            position: "top-right",
          });
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // Construct the URL with query parameters
        const params = {
          status: filter.status,
          priority: filter.priority,
          assignedUser: filter.assignedUser,
        };

        const response = await axios.get("http://localhost:5000/api/tasks/", {
          ...config,
          params, // Include the filters as query parameters
        });
        console.log(response.data);
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch tasks!", { position: "top-right" });
        setLoading(false);
      }
    };
    fetchTasks();
  }, [filter]); // Refetch tasks whenever the filter changes

  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No authorization token found", { position: "top-right" });
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, config);
      setTasks(tasks.filter((task) => task._id !== taskId));

      toast.success("Task deleted successfully!", { position: "top-right" });
    } catch (error) {
      toast.error("Failed to delete task!", { position: "top-right" });
    }
  };

  // Handler for search input
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Handler for filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  // Filter tasks based on search input
  const filteredTasks = tasks.filter((task) =>
    (task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase())) &&
    (filter.status ? task.status === filter.status : true) // Filter by status if selected
  );

  // Check if there are tasks with the selected priority
  const tasksByPriority = filter.priority ? filteredTasks.filter(task => task.priority === filter.priority) : filteredTasks;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-3xl font-semibold text-center text-black mb-8">
        Your Tasks
      </h1>

      {/* Search and Filter Section */}
      <div className="mb-4 flex flex-col md:flex-row md:justify-between">
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={handleSearchChange}
          className="border rounded-lg px-4 py-2 mb-2 md:mb-0"
        />
        <div className="flex space-x-2">
          <select
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <select
            name="priority"
            value={filter.priority}
            onChange={handleFilterChange}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {tasksByPriority.length === 0 ? (
        <p className="text-center text-gray-500">
          {filter.priority ? `No tasks found with ${filter.priority} priority.` : "You have no tasks at the moment."}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasksByPriority.map((task) => (
            <div key={task._id} className="p-4 shadow-md border rounded-lg bg-white">
              <h2 className="text-xl font-semibold text-black mb-2">{task.title}</h2>
              <p className="text-gray-700 mb-2">{task.description}</p>
              <p className="text-gray-600 mb-2">Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
              <p className="text-gray-600 mb-2">Priority: {task.priority}</p>
              <p className="text-gray-600 mb-4">Status: {task.status}</p>

              {/* Conditionally render Edit and Delete options based on user ID and task's createdBy */}
              {task.createdBy === userId && (
                <div className="flex justify-between">
                  <Link
                    to={`/edit-task/${task._id}`} // Navigate to AddTask component for editing
                    className="bg-blue-600 py-1 px-3 rounded-lg text-white font-bold hover:bg-blue-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-600 py-1 px-3 rounded-lg text-white font-bold hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewTasks;
