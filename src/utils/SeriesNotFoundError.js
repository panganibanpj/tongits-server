// @flow
import type { ObjectId } from 'mongoose';

export default class SeriesNotFoundError extends RangeError {
  constructor(seriesId: ObjectId) {
    super(`Cannot find series: "${seriesId.toString()}"`);
  }
}
