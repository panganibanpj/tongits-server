// @flow
import type { MongoId } from 'mongoose';

export type UserType = {|
  email?: string,
  facebookId?: string,
  friends?: Array<MongoId>,
  googleId?: string,
  isConnected: boolean,
  joinDate?: Date,
  picture?: string,
  username: string,
|};
