// @flow
import { Schema, model } from 'mongoose';
import { NAME as User } from './UserModel';
import { NAME as Series } from './SeriesModel';

export default model('match', new Schema({
  seriesId: {
    type: Schema.Types.ObjectId,
    ref: Series,
    required: true,
  },
  round: {
    type: Number,
    default: 0,
    min: 0,
    validate: Number.isInteger,
  },
  better: {
    type: Schema.Types.ObjectId,
    ref: User,
    default: null,
  },
  createTime: {
    type: Date,
    default: Date.now,
  },
  startTime: Date,
  endTime: Date,
  winner: {
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
  turn: {
    type: Number,
    default: 0,
    min: 0,
    validate: Number.isInteger,
  },
  pile: {
    type: [{
      type: String,
      match: /[SHDC][A2-90JQK]/,
    }],
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
      hand: {
        type: [{
          type: String,
          match: /[SHDC][A2-90JQK]/,
        }],
        default: [],
      },
      discard: {
        type: [{
          type: String,
          match: /[SHDC][A2-90JQK]/,
        }],
        default: [],
      },
      melds: {
        sets: {
          type: Map,
          of: [{
            type: String,
            match: /[SHDC][A2-90JQK]/,
          }],
          default: {},
        },
        runs: {
          type: [[{
            type: String,
            match: /[SHDC][A2-90JQK]/,
          }]],
          default: [],
        },
      },
      bet: {
        type: Boolean,
        default: null,
      },
      blockedTurns: {
        type: Number,
        default: -1,
        min: -1,
        validate: Number.isInteger,
      },
      joinTime: {
        type: Date,
        default: null,
      },
    }],
    default: [],
  },
  button: {
    type: Boolean,
    default: false,
  },
}));
