import User from "../models/User.js";


//Create a new user
export const registerUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const token = user.createToken();
    user.token = token;

    //Check file photo
    if(!req.file){
        return res.status(400).json({success: false, message: "Please upload a photo"})
    }

    const photoUrl =  `/uploads/${req.file.filename}`;

    user.photoProfile = photoUrl;

    await user.save();
    res
      .status(201)
      .json({ success: true, message: "User created", user: user });
  } catch (error) {
        console.log(error.message)
  }
};



//Sign in account
export const signIn = async (req, res) => {};

//Confimation account
export const confirmationAccount = async (req, res) => {};

//Forgot password
export const forgotPassword = async (req, res) => {};

//Reset password
export const resetPassword = async (req, res) => {};

//Sign out account
export const signOut = async (req, res) => {};
