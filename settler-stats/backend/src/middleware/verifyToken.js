import jwt from 'jsonwebtoken';
import jwtconfig from '../config/jwt-config.js';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader == undefined) {
    console.log("token undefined");
    return res.status(400).send({ success: false, message: 'Invalid Authentication Token' });
  }
  
  const token = authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).send({ success: false, message: 'Access Denied' })
  };

  try {
    const verified = jwt.verify(token, jwtconfig.secret);
    req.user = verified;
    next();
  } catch (err) {
    console.log("Failed to validate token: ", token);
    return res.status(400).send({ success: false, message: 'Invalid Authentication Token' });
  }
};

export default verifyToken;