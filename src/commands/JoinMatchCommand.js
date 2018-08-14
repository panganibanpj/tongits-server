// @flow
import type { ObjectId } from 'mongoose';
import Series from '../models/SeriesModel';
import fetchAndValidateMatch from './commandHelpers';
import {
  NotEnoughPlayersError,
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

    const match = await fetchAndValidateMatch(matchId, { hasStarted: false });
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
