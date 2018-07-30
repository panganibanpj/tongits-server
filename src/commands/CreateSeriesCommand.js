// @flow
import Series, { type SeriesType } from '../models/SeriesModel';

export class NotEnoughPlayersError extends RangeError {
  constructor() {
    super('Requires at least 1 player');
  }
}

export default class CreateSeriesCommand {
  seriesData: SeriesType;

  constructor(seriesData: SeriesType) {
    // must have at least 1 player
    if (!seriesData.players.length) throw new NotEnoughPlayersError();

    // can add more players later (e.g. players decline, matchmake is async)
    this.seriesData = seriesData;
  }

  execute(): Promise<Series> {
    // should create match? pending players can't see cards
    return Series.create(this.seriesData);
  }
}
