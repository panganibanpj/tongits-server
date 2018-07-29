// @flow
import { Schema, model } from 'mongoose';

export const NAME = 'user';
export default model(NAME, new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: String, // @TODO: email validation
  picture: String, // @TODO: url validation. gravatar? FB? G+?
  joinDate: {
    type: Date,
    default: Date.now,
  },
  isConnected: {
    type: Boolean,
    required: true,
  },
  facebookId: {
    type: String,
    unique: true,
  },
  googleId: {
    type: String,
    unique: true,
  },
}));
