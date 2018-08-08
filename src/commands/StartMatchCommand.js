// @flow
import type { ObjectId } from 'mongoose';
import Match from '../models/MatchModel';
import Series from '../models/SeriesModel';
import {
  MatchNotFoundError,
  SeriesNotFoundError,
} from '../utils/errors';

export class NotAllPlayersJoinedError extends Error {
  constructor(matchId: ObjectId) {
    super(`Not all players in match "${matchId.toString()}" have joined`);
  }
}

export default class StartMatchCommand {
  matchId: ObjectId;

  constructor(matchId: ObjectId) {
    this.matchId = matchId;
  }

  async execute() {
    const { matchId } = this;

    const match = await Match.findById(matchId);
    if (!match) throw new MatchNotFoundError(matchId);
    if (!match.allPlayersJoined) throw new NotAllPlayersJoinedError(matchId);

    let series = await Series.findById(match.seriesId);
    if (!series) throw new SeriesNotFoundError(match.seriesId);

    const sharedStartTime = new Date();
    series = await series.startMatch(sharedStartTime);
    return match.startMatch(series, sharedStartTime);
  }
}
