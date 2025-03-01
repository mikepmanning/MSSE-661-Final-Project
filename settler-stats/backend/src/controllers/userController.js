import User from '../model/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import jwtconfig from '../config/jwt-config.js';

export const getAllUsers = async function (req, res) {
  try {
    const Users = await User.find({});
    res.json(Users);
  } catch (err) {
    res.send(err);
  }
};

export const getUser = async function (req, res) {
  try {
    const user = await User.findById(req.params.userId); 
    if (user) {
      res.status(200).json(getUserWithoutPassword(user));
    } else {
      res.status(404).json({ error: 'User not found' }); 
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: 'Failed to fetch user' }); 
  }
};

export const getUserWithoutPassword = (user) => {
  const { password,...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
};

export const createUser = async function (req, res) {
    console.log("createUser entered");

  //encrypt the password before it is saved to the db.
  const passwordHash = bcrypt.hashSync(req.body.password);

  const newUser = new User({
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    username: req.body.username,
    password: passwordHash,
    email: req.body.email,
    birthdate: req.body.birthdate
  });
  try {
    const savedUser = (await newUser.save());
    console.log("successful registration?");
    res.status(201).json({success: true, message: "Registration Successful", user: getUserWithoutPassword(savedUser)});
  } catch (err) {
    console.log("Error: ", err);
    
    if (err.code === 11000) {
        let dupValue = 'Username';
        if (err.errmsg.includes("email")) {
            dupValue = 'Email';
        }
        res.status(409).json({ error: `${dupValue} already exists` });
    } else if (err.name === 'ValidationError') {
        // Mongoose validation error (e.g., invalid email format)
        res.status(400).json({ error: err.message }); 
    } else {
        // Other errors
        res.status(500).json({ error: 'Registration failed' });
    }
  }
};

export const updateUser = async function (req, res) {
  console.log("Entering updateUser method");
  try {
    const user = await User.findById(req.body.id);
    if (!user) {
      return res.status(404).json({error: "User not found"});
    }
  

    if (req.body.oldPassword) {
      const passwordMatch = await bcrypt.compare(req.body.oldPassword, user.password);
      if (!passwordMatch) {
        return res.status(401).json({error: 'Invalid old password'});
      }
    }

    if (req.body.newPassword) {
      const passwordHash = bcrypt.hashSync(req.body.newPassword);
      req.body.password = passwordHash; //switching to password so we can update correctly after encoding the new password
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.body.id },
      req.body,
      { new: true }
    );

    const resBody = {
      success: true,
      message: "Update Successful",
      user: getUserWithoutPassword(updatedUser),
    }
    res.json(resBody);
  } catch (err) {
    res.send(err);
  }
};

export const deleteUser = async function (req, res) {
  try {
    await User.deleteOne({ _id: req.params.userId });
    res.status(200).json({ msg: 'Deleted successfully.' });
  } catch (err) {
    res.send(err);
  }
};

const verifyJWT = (token, secret) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded); 
      });
    });
  };

export const getUserByToken = async function(req, res) {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, 
      message: 'Login Successful',
      user: getUserWithoutPassword(user),
      });
  } catch (err) {
      res.status(403).json({ success: false, message: 'Failed to authenticate token' });
  }
}
