// @flow
import type { ObjectId } from 'mongoose';
import Series from '../models/SeriesModel';
import User from '../models/UserModel';
import NotEnoughPlayersError from '../utils/NotEnoughPlayersError';
import UserNotFoundError from '../utils/UserNotFoundError';
import SeriesNotFoundError from '../utils/SeriesNotFoundError';

export class SeriesAlreadyStartedError extends RangeError {
  constructor(seriesId: ObjectId) {
    super(`Series already started: "${seriesId.toString()}"`);
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
    if (series.started()) throw new SeriesAlreadyStartedError(seriesId);

    // max player count?

    await series.addPlayers(userIds);
  }
}
