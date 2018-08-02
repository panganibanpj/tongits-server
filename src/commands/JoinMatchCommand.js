// @flow
import type { ObjectId } from 'mongoose';
import User from '../models/UserModel';
import Match from '../models/MatchModel';
import Series from '../models/SeriesModel';
import {
  NotEnoughPlayersError,
  UserNotFoundError,
  MatchNotFoundError,
  MatchAlreadyStartedError,
  PlayersNotInMatchError,
  SeriesNotFoundError,
} from '../utils/errors';

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
    if (match.hasStarted) throw new MatchAlreadyStartedError(matchId);
    if (!match.hasPlayers(userIds)) {
      throw new PlayersNotInMatchError(userIds, matchId);
    }

    const joinTime = new Date();
    await match.joinPlayers(userIds, joinTime);

    if (match.isFirstRound) {
      const series = await Series.findById(match.seriesId);
      if (!series) throw new SeriesNotFoundError(match.seriesId);
      await series.joinPlayers(userIds, joinTime);
    }
  }
}
