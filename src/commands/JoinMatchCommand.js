// @flow
import type { ObjectId } from 'mongoose';
import User from '../models/UserModel';
import Match from '../models/MatchModel';
import Series from '../models/SeriesModel';
import NotEnoughPlayersError from '../utils/NotEnoughPlayersError';
import UserNotFoundError from '../utils/UserNotFoundError';
import SeriesNotFoundError from '../utils/SeriesNotFoundError';

export class MatchNotFoundError extends RangeError {
  constructor(matchId: ObjectId) {
    super(`Cannot find match: "${matchId.toString()}"`);
  }
}

export class MatchAlreadyStartedError extends RangeError {
  constructor(matchId: ObjectId) {
    super(`Match already started: "${matchId.toString()}"`);
  }
}

export class PlayersNotInMatchError extends RangeError {
  constructor(userIds: ObjectId[], matchId: ObjectId) {
    const userIdsString = userIds.join('", "');
    const matchIdString = matchId.toString();
    super(`One of user "${userIdsString}" not in match "${matchIdString}"`);
  }
}

export default class JoinMatchCommand {
  matchId: ObjectId;
  userIds: ObjectId[];

  constructor(matchId: ObjectId, userIds: ObjectId[]) {
    if (!userIds.length) throw new NotEnoughPlayersError();

    this.matchId = matchId;
    this.userIds = userIds;
  }

  async execute(): Promise<void> {
    const { matchId, userIds } = this;

    if (!(await User.allExist(userIds))) throw new UserNotFoundError(userIds);

    const match = await Match.findById(matchId);
    if (!match) throw new MatchNotFoundError(matchId);
    if (match.started()) throw new MatchAlreadyStartedError(matchId);
    if (!match.hasPlayers(userIds)) {
      throw new PlayersNotInMatchError(userIds, matchId);
    }

    const joinTime = new Date();
    await match.playersJoined(userIds, joinTime);

    if (match.round === 0) {
      const series = await Series.findById(match.seriesId);
      if (!series) throw new SeriesNotFoundError(match.seriesId);
      await series.playersJoined(userIds, joinTime);
    }
  }
}
