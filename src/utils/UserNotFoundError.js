// @flow
import type { MongoId } from 'mongoose';

export default class UserNotFoundError extends RangeError {
  constructor(userId: MongoId | Array<MongoId>) {
    super(Array.isArray(userId) && userId.length !== 1
      ? `Cannot find one of user: "${userId.join('", "')}"`
      : `Cannot find user "${Array.isArray(userId) ? userId[0] : userId}"`);
  }
}
