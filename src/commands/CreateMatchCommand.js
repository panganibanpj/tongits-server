// @flow
import type { BSONObjectId } from 'mongoose';
import Match, { type MatchType } from '../models/MatchModel';
import Series from '../models/SeriesModel';
import hasPlayers from '../utils/hasPlayers';
import NotEnoughPlayersError from '../utils/NotEnoughPlayersError';
import SeriesNotFoundError from '../utils/SeriesNotFoundError';

export class PlayersNotInSeriesError extends RangeError {
  constructor(seriesId: BSONObjectId, userIds: Array<BSONObjectId>) {
    const userIdsString = userIds.join('", "');
    const seriesIdString = seriesId.toString();
    super(
      `Some users "${userIdsString}" are not in series "${seriesIdString}"`,
    );
  }
}

export default class CreateMatchCommand {
  matchData: MatchType;

  constructor(matchData: MatchType) {
    if (!matchData.players.length) throw new NotEnoughPlayersError();

    this.matchData = matchData;
  }

  async execute(): Promise<Match> {
    const { matchData } = this;
    const { players, seriesId } = matchData;

    const series = await Series.findById(seriesId);
    if (!series) throw new SeriesNotFoundError(seriesId);

    const userIds = players.map(({ userId }) => userId);
    if (!hasPlayers(series.players, userIds)) {
      throw new PlayersNotInSeriesError(seriesId, userIds);
    }

    return Match.create(matchData);
  }
}
