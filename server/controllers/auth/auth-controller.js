const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

//register
const registerUser = async (req, res) => {
    console.log(req.body); // Log request body
    const { userName, email, password } = req.body;
    console.log(req.body);
    
    try {
      const checkUser = await User.findOne({email});
      if(checkUser)
        return res.json({
          success: false,
          message: "User already exists with same email"
        })
      const hashPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        userName,
        email,
        password: hashPassword,
      });
      await newUser.save();
      res.status(200).json({
        success: true,
        message: "User created successfully",
      });
    } catch (error) {
      console.log(error); // Log detailed error
      res.status(500).json({
        success: false,
        message: "Some error occurred",
      });
    }
  };


//login
const loginUser = async(req, res) => {
    const { email, password} = req.body;

    try {
      const checkUser = await User.findOne({email});
      if(!checkUser)
        return res.json({
          success: false,
          message: "User dosn't exists with this email"
        })
      
      const checkUserPassword = await bcrypt.compare(password, checkUser.password);
      if(!checkUserPassword)
        return res.json({
          success: false,
          message: "Password incorrect"
        })
      
        const token = jwt.sign(
          {
            id: checkUser._id,
            role: checkUser.role,
            email: checkUser.email,
            userName: checkUser.userName,
          },
          'sujay', // secret
          { expiresIn: '1h' } // token expiry (optional)
        );

      res.cookie('token', token, {
        httpOnly: true, 
        secure: true,
        maxAge: 7200000, 
      }).json({
        success: true,
        message: "Logged in successfully",
        user: {
          email: checkUser.email,
          role: checkUser.role,
          id: checkUser._id,
          userName: checkUser.userName,
        }
      });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Some error occured"
        })
        
    }
}


//logout
const logoutUser = (req, res)=>{
  res.clearCookie('token').json({
    success: true,
    message: "LogOut Successfully"
  })
}



//auth middleware
const authMiddleware = async(req, res, next)=>{
  const token = req.cookies.token;
  if(!token) return res.json({
    success: false,
    message: "UnAuthorized user"
  });
  
  try {
    const decode = jwt.verify(token, 'sujay');
    console.log(decode);
    
    req.user = decode;
    next();

  } catch (error) {
    console.log(error);
    res.status(401).json({
      success: false,
      message: "UnAuthorized user"
    });
  }
}
module.exports = { registerUser, loginUser, logoutUser,authMiddleware };