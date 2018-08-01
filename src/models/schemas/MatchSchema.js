// @flow
import { Schema } from 'mongoose';
import { CreateTime, NaturalNumber, User } from './schemaHelpers';
// import { COLLECTION_NAME as Series } from '../SeriesModel';
const Series = 'series';

const Cards = [{
  type: String,
  match: /[SHDC][A2-90JQK]/,
}];

const PlayerSchema = new Schema({
  userId: {
    ...User,
    required: true,
  },
  // series pesos snapshot
  pesos: NaturalNumber,
  hand: Cards,
  discard: Cards,
  melds: {
    sets: {
      type: Map,
      of: Cards,
    },
    runs: [Cards],
  },
  // is calling or started the bet
  bet: Boolean,
  // turns left before can bet
  // why -1?
  blockedTurns: {
    type: Number,
    min: -1,
    validate: Number.isInteger,
  },
  // time ante'd into match
  // also indicator that player has ante'd up
  joinTime: Date,
});

export default {
  seriesId: {
    type: Schema.Types.ObjectId,
    ref: Series,
    // required: true,
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
  pile: Cards,
  turnStarted: Boolean,
  turnEnded: Boolean,
  players: [PlayerSchema],
  // if true, button is first player
  button: Boolean,
};
