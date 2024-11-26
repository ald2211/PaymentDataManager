
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { errorHandler } from './customError.js';

const verifyUser=async (req, res, next) => {
  
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
if (!token) next(errorHandler(401,'unAuthorized'))
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.user.id).select('-password');
    next();
  } catch (error) {
    console.error('Token is not valid:', error.message);
    next(errorHandler(401,'UnAuthorized'))
  }
};

export default verifyUser;