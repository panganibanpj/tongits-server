// @flow
import { Types, type ObjectId } from 'mongoose';
import User from '../src/models/UserModel';
import Series from '../src/models/SeriesModel';
import Match from '../src/models/MatchModel';
import TestUserData from './data/User.json';
import TestMatchData from './data/Match.json';
import TestSeriesData from './data/Series.json';

export const modelId = (id?: string) => new Types.ObjectId(id);
export const randomId = modelId;

const idOverride = (data: ?Object): { _id?: ObjectId } => {
  const { _id: id } = ((data || {}): { _id?: string });
  if (!id) return {};
  return { _id: modelId(id) };
};

export const createUser = (userData: ?Object = {}) => User.create({
  username: `${Math.random()}`,
  ...userData,
  ...idOverride(userData),
});
export const createUserId = async (userData: ?Object) => {
  const user = await createUser(userData);
  return user.getId();
};
export const findUserById = async (userId: string | ObjectId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error(`no user with id ${userId.toString()}`);
  return user;
};


export const createSeries = (
  seriesData: ?Object = {},
) => Series.create({
  ...seriesData,
  ...idOverride(seriesData),
});
export const createSeriesId = async (seriesData: ?Object) => {
  const series = await createSeries(seriesData);
  return series.getId();
};
export const findSeriesById = async (seriesId: string | ObjectId) => {
  const series = await Series.findById(seriesId);
  if (!series) throw new Error(`no series with id ${seriesId.toString()}`);
  return series;
};

export const createMatch = (matchData: ?Object = {}) => Match.create({
  ...matchData,
  ...idOverride(matchData),
});
export const createMatchId = async (matchData: ?Object) => {
  const match = await createMatch(matchData);
  return match.getId();
};
export const findMatchById = async (matchId: string | ObjectId) => {
  const match = await Match.findById(matchId);
  if (!match) throw new Error(`no match with id ${matchId.toString()}`);
  return match;
};

const pickIdsFromTestData = (TestData: Object) => {
  const entries = Object.entries(TestData);
  return entries.reduce((acc, entry) => {
    const [key, modelData] = entry;
    const { _id: id } = ((modelData: any): { _id: string });
    return {
      ...acc,
      [key]: modelId(id),
    };
  }, {});
};

export const createdIds = ({
  user: pickIdsFromTestData(TestUserData),
  series: pickIdsFromTestData(TestSeriesData),
  match: pickIdsFromTestData(TestMatchData),
}: {|
  match: { [string]: ObjectId },
  series: { [string]: ObjectId },
  user: { [string]: ObjectId },
|});

export const resetUser = async (userKey: string) => {
  const userId = createdIds.user[userKey];
  await User.findByIdAndDelete(userId);
  return createUser(TestUserData[userKey]);
};
export const resetSeries = async (seriesKey: string) => {
  const seriesId = createdIds.series[seriesKey];
  await Series.findByIdAndDelete(seriesId);
  return createSeries(TestSeriesData[seriesKey]);
};
export const resetMatch = async (matchKey: string) => {
  const matchId = createdIds.match[matchKey];
  await Match.findByIdAndDelete(matchId);
  return createMatch(TestMatchData[matchKey]);
};
export const resetDocuments = ({ user, series, match }: {
  match?: string[] | string,
  series?: string[] | string,
  user?: string[] | string,
}) => Promise.all([
  ...([].concat(user || [])).map(userKey => resetUser(userKey)),
  ...([].concat(series || [])).map(seriesKey => resetSeries(seriesKey)),
  ...([].concat(match || [])).map(matchKey => resetMatch(matchKey)),
]);
export const resetDb = async () => {
  await Promise.all([
    User.remove({}),
    Match.remove({}),
    Series.remove({}),
  ]);
  const testUserData = ((Object.values(TestUserData): any): User[]);
  const testSeriesData = ((Object.values(TestSeriesData): any): Series[]);
  const testMatchData = ((Object.values(TestMatchData): any): Match[]);
  return Promise.all([
    ...testUserData.map(userData => createUser(userData)),
    ...testMatchData.map(matchData => createMatch(matchData)),
    ...testSeriesData.map(seriesData => createSeries(seriesData)),
  ]);
};

export const executionError = async (command: Object): Promise<?Error> => {
  try {
    await command.execute();
  } catch (error) {
    return error;
  }
  throw new Error('was supposed to throw');
};
export * from '../src/models/modelHelpers';
