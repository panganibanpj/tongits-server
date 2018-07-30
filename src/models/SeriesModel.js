// @flow
import mongoose, { Schema, type BSONObjectId } from 'mongoose';
// import BET_TYPES from '../constants/BET_TYPES';
import { CreateTime, NaturalNumber, User } from '../util/model-helpers';
import type { /* BetType, */ BetTypesType } from '../types/betTypes';

// Players to add to series
// Type used to validate player shape when constructing or adding new players to series
type ConstructorPlayerType = {|
  pesos?: number,
  userId: BSONObjectId,
|};

export type SeriesType = {|
  betType: BetTypesType,
  createTime?: Date,
  jackpot?: number,
  players: Array<ConstructorPlayerType>,
  round?: number,
  twoHits?: BSONObjectId,
|};

const schema = new Schema({
  createTime: CreateTime,
  round: NaturalNumber,
  betType: {
    type: String,
    enum: ['BASIC'], // @TODO: Object.keys(BET_TYPES),
    required: true,
  },
  twoHits: User,
  jackpot: NaturalNumber, // current round's jackpot
  players: [{
    userId: User,
    pesos: NaturalNumber,
  }],
});

// Players already added to series
// Type used to validate access of player properties
type ExistingPlayerType = {|
  pesos: number,
  userId: BSONObjectId,
|};

class Series /* :: extends Mongoose$Document */ {
  createTime: Date;
  round: number;
  betType: BetTypesType;
  twoHits: ?BSONObjectId;
  jackpot: number;
  players: Array<ExistingPlayerType>;
}

schema.loadClass(Series);
export const COLLECTION_NAME = 'series';
export default mongoose.model(COLLECTION_NAME, schema);
