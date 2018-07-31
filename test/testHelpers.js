// @flow
import { Types, type BSONObjectId } from 'mongoose';
import User from '../src/models/UserModel';

export const createId = () => new Types.ObjectId();
export const createUser = () => User.create({ username: `${Math.random()}` });
export const pickUserIds = (players: any): Array<{|
  userId: BSONObjectId,
|}> => players.map(({ userId }) => ({ userId }));
