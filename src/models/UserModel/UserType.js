// @flow
import type { BSONObjectId } from 'mongoose';

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
