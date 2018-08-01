// @flow
import type { ObjectId } from 'mongoose';
import Series from '../models/SeriesModel';
import User from '../models/UserModel';
import addPlayers from '../utils/addPlayers';
import NotEnoughPlayersError from '../utils/NotEnoughPlayersError';
import UserNotFoundError from '../utils/UserNotFoundError';
import SeriesNotFoundError from '../utils/SeriesNotFoundError';

export class SeriesAlreadyStartedError extends RangeError {
  constructor(seriesId: ObjectId) {
    const seriesIdString = seriesId.toString();
    super(`Either no matches or series already started: "${seriesIdString}"`);
  }
}

export default class InvitePlayerCommand {
  seriesId: ObjectId;
  userIds: ObjectId[]

  constructor(seriesId: ObjectId, userIds: ObjectId[] = []) {
    if (!userIds.length) throw new NotEnoughPlayersError();

    this.seriesId = seriesId;
    this.userIds = userIds;
  }

  async execute(): Promise<void> {
    const { seriesId, userIds } = this;

    if (!(await User.allExist(userIds))) throw new UserNotFoundError(userIds);

    const series = await Series.findById(seriesId);
    if (!series) throw new SeriesNotFoundError(seriesId);
    if (series.startTime) throw new SeriesAlreadyStartedError(seriesId);

    // max player count?

    const players = series.players.map(({ userId }) => ({ userId }));
    addPlayers(players, userIds);
    await series.save();
  }
}
