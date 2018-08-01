// @flow
import { Types, type ObjectId } from 'mongoose';
import User from '../src/models/UserModel';

export const createId = () => new Types.ObjectId();
export const createUser = () => User.create({ username: `${Math.random()}` });
type PlayerType = {
  userId: ObjectId,
};
export const pickUserIds = (
  players: any,
): PlayerType[] => players.map(({ userId }) => ({ userId }));
