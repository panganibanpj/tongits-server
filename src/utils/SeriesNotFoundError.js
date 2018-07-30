// @flow
import type { BSONObjectId } from 'mongoose';

export default class SeriesNotFoundError extends RangeError {
  constructor(seriesId: BSONObjectId) {
    super(`Cannot find series: "${seriesId.toString()}"`);
  }
}
