// @flow
import type { BSONObjectId } from 'mongoose';

export default class UserNotFoundError extends RangeError {
  constructor(userId: BSONObjectId | Array<BSONObjectId>) {
    super(Array.isArray(userId) && userId.length !== 1
      ? `Cannot find one of user: "${userId.join('", "')}"`
      : `Cannot find user "${(Array.isArray(userId) ? userId[0] : userId).toString()}"`);
  }
}
