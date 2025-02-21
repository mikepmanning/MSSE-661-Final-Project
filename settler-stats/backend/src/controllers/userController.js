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

const getUserWithoutPassword = (user) => {
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
  try {
    if (req.body.password) {
      const passwordHash = bcrypt.hashSync(req.body.password);
      req.body.password = passwordHash;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.UserId },
      req.body,
      { new: true }
    );
    res.json(getUserWithoutPassword(updatedUser));
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
    const token = req.headers['auth-token'];
    if (!token) {
        res.status(401).send({success: 'false', message: 'No token provided'});
    }
    
    try {
        const decoded = await verifyJWT(token, jwtconfig.secret);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json(getUserWithoutPassword(user));
    } catch (err) {
        res.status(403).json({ success: false, message: 'Failed to authenticate token' });
    }
}
