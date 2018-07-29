// @flow
import { Schema, model } from 'mongoose';
import { CreateTime, User } from '../util/model-helpers';

export default model('user', new Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: String, // @TODO: email validation
  picture: String, // @TODO: url validation. gravatar? FB? G+?
  joinDate: CreateTime,
  isConnected: {
    type: Boolean,
    required: true,
  },
  friends: {
    type: [User],
    default: [],
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
