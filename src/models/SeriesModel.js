// @flow
import { Schema, model } from 'mongoose';
import { NAME as User } from './UserModel';

export const NAME = 'series';
export default model(NAME, new Schema({
  createTime: {
    type: Date,
    default: Date.now,
  },
  round: {
    type: Number,
    default: 0,
    min: 0,
    validate: Number.isInteger,
  },
  betType: {
    type: String,
    enum: ['BASIC'],
    required: true,
  },
  twoHits: {
    type: Schema.Types.ObjectId,
    ref: User,
    default: null,
  },
  jackpot: {
    type: Number,
    default: 0,
    min: 0,
    validate: Number.isInteger,
  },
  players: {
    type: [{
      userId: {
        type: Schema.Types.ObjectId,
        ref: User,
        default: null,
      },
      pesos: {
        type: Number,
        default: 0,
        min: 0,
        validate: Number.isInteger,
      },
    }],
    default: [],
  },
}));
