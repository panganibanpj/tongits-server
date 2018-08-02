// @flow
import type { ObjectId } from 'mongoose';
import Series, { type PlayerType } from '../models/SeriesModel';
import Match from '../models/MatchModel';
import User from '../models/UserModel';
import { NotEnoughPlayersError, UserNotFoundError } from '../utils/errors';
import type { BetTypesType } from '../types/betTypes';

type SeriesDataType = {|
  betType: BetTypesType,
  createTime?: Date,
  jackpot?: number,
  players: PlayerType[],
  round?: number,
  startTime?: Date,
  twoHits?: ObjectId,
|};

export default class CreateSeriesCommand {
  seriesData: SeriesDataType;
  createMatch: boolean;

  constructor(seriesData: SeriesDataType, createMatch: boolean = true) {
    if (!seriesData.players.length) throw new NotEnoughPlayersError();

    this.createMatch = createMatch;
    this.seriesData = seriesData;
  }

  async execute(): Promise<Series> {
    const userIds = this.seriesData.players.map(({ userId }) => userId);
    if (!(await User.allExist(userIds))) throw new UserNotFoundError(userIds);

    const series = await Series.create({
      ...Series.defaults(),
      ...this.seriesData,
    });
    if (series && this.createMatch) {
      // @TODO: should wait and watch for error?
      await Match.create({
        ...Match.defaults(),
        seriesId: series.getId(),
        players: userIds.map(Match.makeNewPlayer),
      });
    }

    return series;
  }
}
