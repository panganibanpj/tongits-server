// @flow
import type { ObjectId } from 'mongoose';
import User from '../models/UserModel';

type UserDataType = {|
  email?: string,
  facebookId?: string,
  friends?: ObjectId[],
  googleId?: string,
  isConnected: boolean,
  joinDate?: Date,
  picture?: string,
  username: string,
|};

export default class CreateUserCommand {
  userData: UserDataType;

  constructor(userData: UserDataType) {
    this.userData = userData;
  }

  execute(): Promise<User> {
    return User.create({
      ...User.defaults(),
      ...this.userData,
    });
  }
}
