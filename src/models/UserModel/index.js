// @flow
import mongoose, { Schema, type BSONObjectId } from 'mongoose';
import BaseModel from '../BaseModel';
import UserSchema from './UserSchema';

const schema = new Schema(UserSchema);

class UserClass extends BaseModel {
  username: string;
  email: ?string;
  picture: ?string;
  joinDate: Date;
  isConnected: boolean;
  friends: Array<BSONObjectId>;
  facebookId: ?string;
  googleId: ?string;

  static async allExist(userIds: Array<BSONObjectId> = []): Promise<boolean> {
    if (!userIds.length) return Promise.resolve(false);
    const existences = await Promise.all(
      userIds.map(userId => this.exists(userId)),
    );
    return existences.every(exists => exists);
  }
}

schema.loadClass(UserClass);
export default mongoose.model('user', schema);
export * from './UserType';
