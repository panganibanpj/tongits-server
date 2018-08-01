// @flow
import type { ObjectId } from 'mongoose';

const getUserId = (userId: ObjectId | ObjectId[]) => (
  Array.isArray(userId) ? userId[0] : userId
);

export default class UserNotFoundError extends RangeError {
  constructor(userId: ObjectId | ObjectId[]) {
    super(Array.isArray(userId) && userId.length !== 1
      ? `Cannot find one of user: "${userId.join('", "')}"`
      : `Cannot find user "${(getUserId(userId) || '').toString()}"`);
  }
}
