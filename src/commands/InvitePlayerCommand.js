// @flow
import type { ObjectId } from 'mongoose';
import Series from '../models/SeriesModel';
import User from '../models/UserModel';
import {
  NotEnoughPlayersError,
  UserNotFoundError,
  SeriesNotFoundError,
} from '../utils/errors';

export class SeriesAlreadyStartedError extends RangeError {
  constructor(seriesId: ObjectId) {
    super(`Series already started: "${seriesId.toString()}"`);
  }
}

export default class InvitePlayerCommand {
  seriesId: ObjectId;
  userIds: ObjectId[]

  constructor(seriesId: ObjectId, userIds: ObjectId[]) {
    if (!userIds.length) throw new NotEnoughPlayersError();

    this.seriesId = seriesId;
    this.userIds = userIds;
  }

  async execute(): Promise<void> {
    const { seriesId, userIds } = this;

    if (!(await User.allExist(userIds))) throw new UserNotFoundError(userIds);

    const series = await Series.findById(seriesId);
    if (!series) throw new SeriesNotFoundError(seriesId);
    if (series.hasStarted) throw new SeriesAlreadyStartedError(seriesId);

    await series.addPlayers(userIds);
  }
}
