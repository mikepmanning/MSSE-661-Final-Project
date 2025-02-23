// Require Mongoose
import mongoose from 'mongoose';

// Define a schema
const Schema = mongoose.Schema;

// Create a new Schema for our collection
const UserSchema = new Schema({
  firstName: {
    type: String,
    required: 'User requires a first name'
  },
  middleName: {
    type: String
  },
  lastName: {
    type: String,
    required: 'User requires a last name'
  },
  birthdate: {
    type: Date,
    required: 'User requires a birthdate',
    transform: (v) => v.setUTCHours(0,0,0,0)
  },
  username: {
    type: String,
    unique: true,
    required: 'User requires a username'
  },
  password: {
    type: String,
    required: 'User requires a password'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

// Expose the collections functions for use in our controller
export default mongoose.model('User', UserSchema);