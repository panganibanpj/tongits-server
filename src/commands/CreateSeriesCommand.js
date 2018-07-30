// @flow
import Series, { type SeriesType } from '../models/SeriesModel';
import User from '../models/UserModel';
import NotEnoughPlayersError from '../utils/NotEnoughPlayersError';
import UserNotFoundError from '../utils/UserNotFoundError';

export default class CreateSeriesCommand {
  seriesData: SeriesType;

  constructor(seriesData: SeriesType) {
    if (!seriesData.players.length) throw new NotEnoughPlayersError();

    this.seriesData = seriesData;
  }

  async execute(): Promise<Series> {
    const userIds = this.seriesData.players.map(({ userId }) => userId);
    if (!(await User.allExist(userIds))) throw new UserNotFoundError(userIds);

    return Series.create(this.seriesData);
  }
}
