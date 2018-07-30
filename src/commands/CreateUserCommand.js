// @flow
import User, { type UserType } from '../models/UserModel';

export default class CreateUserCommand {
  userData: UserType;

  constructor(userData: UserType) {
    this.userData = userData;
  }

  async execute(): Promise<User> {
    return User.create(this.userData);
  }

  // undo() {
  //   // delete the user
  // }
}
