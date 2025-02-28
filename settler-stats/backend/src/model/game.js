import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const GameSchema = new Schema({
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true
  }],
  started_date: {
    type: Date,
    default: Date.now 
  }
});

export default mongoose.model('Game', GameSchema);
