var express = require("express");
var app = express();
var router = express.Router();
const User = require("../models/User");
var bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
const e = require("express");
const fetchUser = require("../middleware/fetchUser");

const JWT_SECRET = "jatin";
//Create a User using POST at /api/auth/createuser
router.post(
  "/createuser",
  body("name").isLength({ min: 5 }),
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ errors: "Email Already Exists" });

    var salt = await bcrypt.genSaltSync(10);
    var secPass = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    });
    data = {
      id: user.id,
    };
    const authToken = jwt.sign(data, JWT_SECRET);
    // console.log(jwtData);
    res.json({ authToken });
  }
);

//Route to Login the user
router.post(
  "/login",
  body("email").isEmail(),
  body("password").exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    let user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).json({ errors: "Enter Valid Credentials" });
    // email = req.body.email;
    // password = req.body.password;
    //Destructuring
    const {email,password}=req.body;
    const passCompare = await bcrypt.compare(password, user.password);
    if (!passCompare)
      return res.status(400).json({ errors: "Enter Valid Credentials" });
    else
    {
      data = {
        id: user.id,
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      // console.log(jwtData);
      res.json({ authToken });
    }
  }
);


//Route to Get Details Of the user //Login Required
router.post('/getuser',fetchUser,async(req,res)=>{
  userId=req.id;
  const user=await User.findById(userId).select("-password")
  res.json(user);


})
module.exports = router;
