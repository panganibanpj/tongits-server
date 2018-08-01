// @flow
import { Types } from 'mongoose';
import User from '../src/models/UserModel';
import Series from '../src/models/SeriesModel';
import Match from '../src/models/MatchModel';

export const randomId = () => new Types.ObjectId();
export const createUser = (userData: ?Object = {}) => User.create({
  username: `${Math.random()}`,
  ...userData,
});
export const createUserId = async (userData: ?Object) => {
  const user = await createUser(userData);
  return user.getId();
};
export const createSeriesId = async (seriesData: ?Object = {}) => {
  const series = await Series.create(seriesData);
  return series.getId();
};
export const createMatchId = async (matchData: ?Object = {}) => {
  const match = await Match.create(matchData);
  return match.getId();
};
