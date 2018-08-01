// @flow
import mongoose, { Schema, type ObjectId } from 'mongoose';
import BaseModel from './BaseModel';
import UserSchema from './schemas/UserSchema';

const schema = new Schema(UserSchema);

class User extends BaseModel {
  username: string;
  email: ?string;
  picture: ?string;
  createTime: Date;
  isConnected: boolean;
  friends: ObjectId[];
  facebookId: ?string;
  googleId: ?string;

  static defaults() {
    return {
      friends: [],
    };
  }

  static async allExist(userIds: ObjectId[] = []): Promise<boolean> {
    if (!userIds.length) return Promise.resolve(false);
    const existences = await Promise.all(
      userIds.map(userId => this.exists(userId)),
    );
    return existences.every(exists => exists);
  }
}

schema.loadClass(User);
export default mongoose.model('user', schema);
