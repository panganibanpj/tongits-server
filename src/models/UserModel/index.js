// @flow
import mongoose, { Schema, type MongoId } from 'mongoose';
import BaseModel from '../BaseModel';
import UserSchema from './UserSchema';

const schema = new Schema(UserSchema);

class UserClass extends BaseModel {
  username: string;
  email: ?string;
  picture: ?string;
  joinDate: Date;
  isConnected: boolean;
  friends: Array<MongoId>;
  facebookId: ?string;
  googleId: ?string;
}

schema.loadClass(UserClass);
export default mongoose.model('user', schema);
export * from './UserType';
