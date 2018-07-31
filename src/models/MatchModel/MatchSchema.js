// @flow
import { Schema } from 'mongoose';
import { CreateTime, NaturalNumber, User } from '../../utils/modelHelpers';
import { COLLECTION_NAME as Series } from '../SeriesModel';

const Cards = [{
  type: String,
  match: /[SHDC][A2-90JQK]/,
}];

export default {
  seriesId: {
    type: Schema.Types.ObjectId,
    ref: Series,
    required: true,
  },
  round: NaturalNumber,
  better: User,
  createTime: CreateTime,
  // inidicator that game has started
  startTime: Date,
  endTime: Date,
  winner: User,
  jackpot: NaturalNumber,
  turn: NaturalNumber,
  pile: {
    type: Cards,
    default: null,
  },
  turnStarted: {
    type: Boolean,
    default: true,
  },
  turnEnded: {
    type: Boolean,
    default: false,
  },
  players: {
    type: [{
      userId: User,
      // series pesos snapshot
      pesos: NaturalNumber,
      hand: {
        type: Cards,
        default: [],
      },
      discard: {
        type: Cards,
        default: [],
      },
      melds: {
        sets: {
          type: Map,
          of: Cards,
          default: {},
        },
        runs: {
          type: [Cards],
          default: [],
        },
      },
      // is calling or started the bet
      bet: {
        type: Boolean,
        default: null,
      },
      // turns left before can bet
      // why -1?
      blockedTurns: {
        type: Number,
        default: -1,
        min: -1,
        validate: Number.isInteger,
      },
      // time ante'd into match
      // also indicator that player has ante'd up
      joinTime: {
        type: Date,
        default: null,
      },
    }],
    default: [],
  },
  // if true, button is first player
  button: {
    type: Boolean,
    default: false,
  },
};
