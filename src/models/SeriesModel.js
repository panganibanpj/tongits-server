// @flow
import { Schema, model } from 'mongoose';
import { CreateTime, NaturalNumber, User } from '../util/model-helpers';

export const NAME = 'series';
export default model(NAME, new Schema({
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
}));
