// @flow
import mongoose, { Schema, type BSONObjectId } from 'mongoose';
import { CreateTime, User as UserRef } from '../utils/model-helpers';

export type UserType = {|
  email?: string,
  facebookId?: string,
  friends?: Array<BSONObjectId>,
  googleId?: string,
  isConnected: boolean,
  joinDate?: Date,
  picture?: string,
  username: string,
|};

const schema = new Schema({
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
    type: [UserRef],
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
});

class User /* :: extends Mongoose$Document */ {
  username: string;
  email: ?string;
  picture: ?string;
  joinDate: Date;
  isConnected: boolean;
  friends: Array<BSONObjectId>;
  facebookId: ?string;
  googleId: ?string;
}

schema.loadClass(User);
export default mongoose.model('user', schema);
