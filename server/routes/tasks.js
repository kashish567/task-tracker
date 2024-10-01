import { Router } from "express";
import Task from "../models/task.js";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/user.js";
import { stringify } from "csv-stringify";

const router = Router();

// Create a task
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, assignedUser } = req.body;
    
    // Log the incoming data for debugging
    console.log("Request Body:", req.body);
    
    // Create a new task
    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      createdBy: req.user.id,  // Assuming req.user is populated by authMiddleware
      assignedUser
    });
    
    // Save the task to the database
    await task.save();

    // Add the task to the creator's task array
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.tasks.push(task._id);
    await user.save();
    
    // Log user task array after push
    console.log("Creator's task array:", user.tasks);

    // Add the task to the assigned user's task array
    const assignUser = await User.findById(assignedUser);
    if (!assignUser) {
      return res.status(404).json({ message: "Assigned user not found" });
    }
    assignUser.tasks.push(task._id);
    await assignUser.save();
    
    // Log assigned user task array after push
    console.log("Assigned user's task array:", assignUser.tasks);

    // Send the created task as a response
    res.json(task);

  } catch (err) {
    console.error("Error in task creation:", err);
    res.status(500).json({ message: "Server --------" });
  }
});

// Get all tasks
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await User.findById(req.user.id).populate("tasks");
    console.log(tasks);
    return res.json(tasks.tasks);
  } catch (err) {
    return res.status(500).json({ message: "Server " });
  }
});


router.get("/report", async (req, res) => {
  try {
    const { status, user, startDate, endDate, format } = req.query;

    // Debugging: Log the incoming query parameters
    console.log("Query Parameters: ", req.query);

    const filters = {};

    // Apply filters if provided
    if (status) filters.status = status;
    if (user) filters.assignedUser = user; // Ensure this matches your model's field
    if (startDate || endDate) {
      filters.dueDate = {};
      if (startDate) filters.dueDate.$gte = new Date(startDate);
      if (endDate) filters.dueDate.$lte = new Date(endDate);
    }

    // Fetch tasks based on the filters
    const tasks = await Task.find(filters)
      .populate("assignedUser", "name email") // Populate assignedUser to get user details
      .populate("createdBy", "name email") // Populate createdBy to get user details
      .exec();

    // Debugging: Log the tasks fetched from the database
    console.log("Tasks fetched: ", tasks);

    // If CSV format is requested
    if (format === "csv") {
      if (tasks.length === 0) {
        console.log("No tasks found for the given filters.");
        return res.status(404).json({ message: "No tasks found" });
      }

      // Define CSV headers
      const columns = [
        "Title",
        "Description",
        "Due Date",
        "Status",
        "Priority",
        "Assigned User",
        "Created By",
      ];

      const csvData = tasks.map((task) => [
        task.title,
        task.description,
        task.dueDate.toISOString().split("T")[0], // Format date to YYYY-MM-DD
        task.status,
        task.priority,
        task.assignedUser ? task.assignedUser.name : "N/A",
        task.createdBy ? task.createdBy.name : "N/A",
      ]);

      // Generate CSV and return it
      stringify([columns, ...csvData], (err, output) => {
        if (err) {
          console.error("Error generating CSV: ", err);
          return res.status(500).json({ message: "Error generating CSV" });
        }
        res.header("Content-Type", "text/csv");
        res.attachment("tasks_report.csv");
        return res.send(output);
      });
    } else {
      // Return tasks as JSON if CSV format is not requested
      return res.json(tasks);
    }
  } catch (err) {
    console.log("Error generating report: ", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get a task
router.get("/:id", authMiddleware, async (req, res) => {
  console.log(`GET /:id called with ID: ${req.params.id}`);
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (task.createdBy.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });
    return res.json(task);
  } catch (err) {
    console.error("Error fetching task:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Update a task

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, dueDate, priority,status } = req.body;
    
    const task = await Task.findById(req.params.id);
    console.log(task)
    if (!task) return res.status(404).json({ message: "Task not found" });
    
    if (task.createdBy.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });
    task.title = title;
    task.description = description;
    task.dueDate = dueDate;
    task.priority = priority;
    task.status = status;
    await task.save();
    return res.json(task);
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Server task" });
  }
});

// Delete a task
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check if the logged-in user is the creator of the task
    if (task.createdBy.toString() !== req.user.id)
      return res.status(401).json({ message: "Not authorized" });

    // Remove task from the creator's task list
    const creator = await User.findById(req.user.id);
    creator.tasks = creator.tasks.filter(
      (taskId) => taskId.toString() !== req.params.id
    );
    await creator.save();

    // Remove the task from the assigned users' task lists
    const assignedUsers = await User.find({ _id: { $in: task.assignedTo } });

    for (let user of assignedUsers) {
      user.tasks = user.tasks.filter(
        (taskId) => taskId.toString() !== req.params.id
      );
      await user.save();
    }

    // Delete the task from the database
    await Task.findByIdAndDelete(req.params.id);

    return res.json({ message: "Task removed successfully" });
  } catch (err) {
    console.log("Error:", err);
    return res.status(500).json({ message: "Server meesage" });
  }
});


export default router;
