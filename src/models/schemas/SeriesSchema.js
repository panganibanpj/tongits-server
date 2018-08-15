// @flow
import { Schema } from 'mongoose';
import {
  CreateTime,
  NaturalNumber,
  User,
  Integer,
} from './schemaHelpers';
// import BET_TYPES from '../constants/BET_TYPES';
// import type { BetType } from '../../types/betTypes';

const PlayerSchema = new Schema({
  userId: {
    ...User,
    required: true,
  },
  pesos: Integer, // pesos for series
  joinTime: Date,
}, { typeKey: '$type' });

export default {
  createTime: CreateTime,
  round: NaturalNumber,
  betType: {
    $type: String,
    enum: ['BASIC'], // @TODO: Object.keys(BET_TYPES),
    // required: true,
  },
  twoHits: User,
  jackpot: NaturalNumber, // current jackpot
  players: [PlayerSchema],
  startTime: Date,
};
