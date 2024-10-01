import { Router } from "express";
import bcrypt from "bcryptjs"; // Default import
const { hash, compare } = bcrypt;
import User from "../models/user.js";
import { body, validationResult } from "express-validator";
import pkg from "jsonwebtoken"; // Use default import
import authMiddleware from "../middleware/authMiddleware.js";
const { sign, verify } = pkg; // Destructure to get sign and verify
const router = Router();

// Register a new user
router.post(
  "/register",
  async (req, res) => {
    let { name, email, password, role} = req.body;
    // console.log(role)
    try {
      // Use User.findOne instead of findOne
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "User already exists" });
      
      if(role !== "Admin") {
        // console.log("user")
        role="User"
      }


      user = new User({ name, email, password: await hash(password, 10) ,role});
      await user.save();

      // Generate JWT token
      const payload = { user: { id: user.id, role: user.role } };
      const token = sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.json({ token });
    } catch (err) {
      // console.error(err); // Log the actual error
      res.status(500).send("Server --");
    }
  }
);

// Login user
router.post(
  "/login",
  async (req, res) => {
    // console.log(req.body)
    const { email, password } = req.body;
    
    try {
      // Use User.findOne instead of findOne
      const user = await User.findOne({ email });
      // console.log(user)
      if (!user)
        return res.status(400).json({ message: "Invalid Credentials" });

      const isMatch = await compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid Credentials" });

      // Generate JWT token
      const payload = { user: { id: user.id, role: user.role } };
      const token = sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

      user.password = undefined;

      res.json({ token,user });
    } catch (err) {
      // console.error(err); // Log the actual error
      res.status(500).send("Server ---");
    }
  }
);

// Get user details

router.get("/getUser",authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    return res.json(user);
  } catch (err) {
    // console.error(err);
    return res.status(500).send("Server ----");
  } 
});

//get all user instead the given user

router.get("/get-all-user",authMiddleware,async(req,res)=>{
  try{
    
    const user = await User.find({role:"User"});
    // console.log(user)
    return res.json(user);
  }catch(err){
    console.error(err);
    return res.status(500).send("Server -----");
  }
})



export default router;
