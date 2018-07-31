// @flow
import type { BSONObjectId } from 'mongoose';
import Series from '../models/SeriesModel';
import Match from '../models/MatchModel';
import User from '../models/UserModel';
import addPlayers from '../utils/addPlayers';
import NotEnoughPlayersError from '../utils/NotEnoughPlayersError';
import UserNotFoundError from '../utils/UserNotFoundError';
import SeriesNotFoundError from '../utils/SeriesNotFoundError';

export class MatchNotFoundError extends RangeError {
  constructor(matchId: BSONObjectId) {
    super(`Cannot find match: "${matchId.toString()}"`);
  }
}

export class MatchAlreadyStartedError extends Error {
  constructor(matchId: BSONObjectId) {
    super(`Match "${matchId.toString()}" already started`);
  }
}

export class SeriesAlreadyStartedError extends Error {
  constructor(seriesId: BSONObjectId) {
    super(`Series "${seriesId.toString()}" already started`);
  }
}

export default class InvitePlayerCommand {
  matchId: BSONObjectId;
  userIds: Array<BSONObjectId>

  constructor(matchId: BSONObjectId, userIds: Array<BSONObjectId> = []) {
    if (!userIds.length) throw new NotEnoughPlayersError();

    this.matchId = matchId;
    this.userIds = userIds;
  }

  async execute() {
    const { matchId, userIds } = this;

    if (!(await User.allExist(userIds))) throw new UserNotFoundError(userIds);

    const match = await Match.findById(matchId);
    if (!match) throw new MatchNotFoundError(matchId);

    const { seriesId } = match;
    // @NOTE: once the first match of a series has started, players are locked
    if (match.startTime) throw new MatchAlreadyStartedError(matchId);
    // @NOTE: a series is a sequence of matches between the same set of players
    if (match.round !== 0) throw new SeriesAlreadyStartedError(seriesId);

    // max player count?

    const series = await Series.findById(seriesId);
    if (!series) throw new SeriesNotFoundError(seriesId);

    addPlayers(series.players, userIds);
    addPlayers(match.players, userIds);
    await Promise.all([series.save(), match.save()]);
  }
}
