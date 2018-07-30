// @flow
import Series, { type SeriesType } from '../models/SeriesModel';
import User from '../models/UserModel';
import NotEnoughPlayersError from '../utils/NotEnoughPlayersError';
import UserNotFoundError from '../utils/UserNotFoundError';

export default class CreateSeriesCommand {
  seriesData: SeriesType;

  constructor(seriesData: SeriesType) {
    // must have at least 1 player
    if (!seriesData.players.length) throw new NotEnoughPlayersError();

    // can add more players later (e.g. players decline, matchmake is async)
    this.seriesData = seriesData;
  }

  async execute(): Promise<Series> {
    const userIds = this.seriesData.players.map(({ userId }) => userId);
    if (!(await User.allExist(userIds))) throw new UserNotFoundError(userIds);

    // should create match? pending players can't see cards
    return Series.create(this.seriesData);
  }
}
