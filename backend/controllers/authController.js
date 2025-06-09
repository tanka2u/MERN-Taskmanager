const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (userID) => {
    return jwt.sign({ id: userID}, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Register a new user
// @route   Post /api/auth/register
// @access  Public
const registerUser= async (req, res) => {
    try {
        const { name, email, password, profile, profileImageUrl, adminInviteToken} = req.body;

        // If the user is already registered
        const userExists = await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: "User Already Exists."});
        }

        // Determine user roles: Admin if correct Token is Provided, otherwise Member
        let role = "member";
        if (
            adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN
        ){
            role = "admin";
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role,
        });

        // return user data with JWT
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageURL: user.profileImageUrl,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// @desc    Login User
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({message: "Invalid Password or Username.."});
        }

        // Compare password
        const isMatched = await bcrypt.compare(password, user.password)
        if(!isMatched){
            return res.status(401).json({message: "Invalid Password or Username.."});
        }

        // Return user data with JWT
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

// @desc    Get User Profile
// @route   POST /api/auth/profile
// @access  Private (Requires JWT)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if(!user){
            return res.status(404).json({ message: "User not found! "});
        }
        res.json(user)
    } catch (error) {
        res.status(500).json({message: "User Server error", error: error.message});
    }
};

// @desc    Update User Profile
// @route   PUT /api/auth/profile
// @access  Private (Requires JWT)
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(404).json({ message: "User not found!"});
        }

        user.name=req.body.name || user.name;
        user.email=req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken(updatedUser._id),
        });
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

module.exports = {registerUser, loginUser, getUserProfile, updateUserProfile};

/*{
    "name": "Dustin",
    "email": "dustin@timetoprogram.com",
    "password": "test@123",
    "profileImageUrl": "http://localhost:8000/uploads/1741014248464-profile-4.jpg",
    "adminInviteToken": "4588944"
}*/
