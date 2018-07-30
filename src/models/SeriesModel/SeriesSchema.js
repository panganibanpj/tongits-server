// @flow
import { CreateTime, NaturalNumber, User } from '../../utils/model-helpers';
// import BET_TYPES from '../constants/BET_TYPES';
// import type { BetType } from '../../types/betTypes';

export default {
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
};
