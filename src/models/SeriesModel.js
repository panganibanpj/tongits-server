// @flow
import mongoose, { Schema, type MongoId } from 'mongoose';
// import BET_TYPES from '../constants/BET_TYPES';
import { CreateTime, NaturalNumber, User } from '../utils/model-helpers';
import type { /* BetType, */ BetTypesType } from '../types/betTypes';

// Before players join the series they will not have many fields populated
type InvitedPlayerType = {|
  userId: MongoId,
|};

type JoinedPlayerType = {|
  pesos: number,
  userId: MongoId,
|};

export type SeriesType = {|
  betType: BetTypesType,
  createTime?: Date,
  jackpot?: number,
  players: Array<InvitedPlayerType | JoinedPlayerType>,
  round?: number,
  twoHits?: MongoId,
|};

class Series /* :: extends Mongoose$Document */ {
  createTime: Date;
  round: number;
  betType: BetTypesType;
  twoHits: ?MongoId;
  jackpot: number;
  players: Array<InvitedPlayerType | JoinedPlayerType>;
}

const schema = new Schema({
  createTime: CreateTime,
  round: NaturalNumber,
  betType: {
    type: String,
    enum: ['BASIC'], // @TODO: Object.keys(BET_TYPES),
    required: true,
  },
  twoHits: User,
  jackpot: NaturalNumber, // current jackpot
  players: [{
    userId: User,
    pesos: NaturalNumber, // pesos for series
  }],
});

schema.loadClass(Series);
export const COLLECTION_NAME = 'series';
export default mongoose.model(COLLECTION_NAME, schema);
