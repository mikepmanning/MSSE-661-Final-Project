import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../model/user.js';
import jwtconfig from '../config/jwt-config.js';


export const login = async (req, res) => {
    console.log("Entering login method");
    try {

        const { username, password } = req.body;

        if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required' }); // 400 Bad Request
        }

      const user = await User.findOne({ username: username });
  
      if (!user) {
        console.log("failed to login - invalid username");
        return res.status(401).json({ success: false, message: 'Invalid username' }); 
      }
  
      const passwordMatch = await bcrypt.compare(req.body.password, user.password);
  
      if (!passwordMatch) {
        console.log("failed to login - invalid password");
        return res.status(401).json({ success: false, message: 'Invalid password' });
      }

      const token = jwt.sign(
        { userId: user._id },
        jwtconfig.secret, 
        { expiresIn: '4h' }
      );
  
      console.log("Login success!");
      res.setHeader('Access-Control-Expose-Headers', 'auth-token');
      res.setHeader('auth-token', token);
      res.status(200);
      res.json({ success: true, 
        message: 'Login Successful',
        firstName: user.firstName,
        lastName: user.lastName
        });
      return res;
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ success: false, message: 'An error occurred during login' });
    }
  };
