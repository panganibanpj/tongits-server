// @flow
import mongoose, { Schema, type BSONObjectId } from 'mongoose';
import { CreateTime, NaturalNumber, User } from '../util/model-helpers';
import type { BetTypesType } from '../types/betTypes';

type PlayerType = {|
  pesos: number,
  userId: string,
|};

export type SeriesType = {|
  betType: BetTypesType,
  createTime?: Date,
  jackpot?: number,
  players?: Array<PlayerType>,
  round?: number,
  twoHits?: BSONObjectId,
|};

const schema = new Schema({
  createTime: CreateTime,
  round: NaturalNumber,
  betType: {
    type: String,
    enum: ['BASIC'],
    required: true,
  },
  twoHits: User,
  jackpot: NaturalNumber, // current round's jackpot
  players: {
    type: [{
      userId: User,
      pesos: NaturalNumber,
    }],
    default: [],
  },
});

class Series /* :: extends Mongoose$Document */ {
  createTime: Date;
  round: number;
  betType: BetTypesType;
  twoHits: ?BSONObjectId;
  jackpot: number;
  players: Array<PlayerType>;
}

schema.loadClass(Series);
export const COLLECTION_NAME = 'series';
export default mongoose.model(COLLECTION_NAME, schema);
