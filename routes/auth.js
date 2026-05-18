const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "ahmadisgoodb$oy";

// ================= ROUTE 1: CREATE USER =================
// POST api/auth/createuser
router.post(
  "/createuser",
  [
    body("name", "Name kam az kam 3 characters ka ho").isLength({ min: 3 }),
    body("email", "Valid email enter karo").isEmail(),
    body("password", "Password kam az kam 5 characters ka ho").isLength({ min: 3 }),
  ],
  async (req, res) => {
    let success = false;

    // validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    try {
      // 🔴 CHECK: email pehle se exist to nahi?
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: "Sorry, user with this email already exists",
        });
      }

      // password hash
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // create user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      // JWT payload
      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;

      res.json({ success, authtoken });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ================= ROUTE 2: LOGIN USER =================
// POST api/auth/login
router.post(
  "/login",
  [
    body("email", "Valid email enter karo").isEmail(),
    body("password", "Password blank nahi ho sakta").exists(),
  ],
  async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Invalid credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ success, error: "Invalid credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;

      res.json({ success, authtoken });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ================= ROUTE 3: GET LOGGED IN USER =================
// GET api/auth/getuser
router.get("/getuser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
