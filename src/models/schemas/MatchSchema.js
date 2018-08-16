// @flow
import { Schema } from 'mongoose';
import {
  CreateTime,
  NaturalNumber,
  User,
  Integer,
} from './schemaHelpers';
// import { COLLECTION_NAME as Series } from '../SeriesModel';
const Series = 'series';

const Cards = [{
  $type: String,
  match: /[SHDC][A2-90JQK]/,
}];

const PlayerSchema = new Schema({
  userId: {
    ...User,
    required: true,
  },
  // series pesos snapshot
  pesos: Integer,
  hand: Cards,
  discard: Cards,
  melds: [{
    type: String,
    cards: Cards,
    setRank: String,
  }],
  // is calling or started the bet
  bet: Boolean,
  blocked: Boolean,
  // time ante'd into match
  // also indicator that player has ante'd up
  joinTime: Date,
}, { typeKey: '$type' });

export default {
  seriesId: {
    $type: Schema.Types.ObjectId,
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
  shouldEnd: Boolean,
  players: [PlayerSchema],
  // if true, button is first player
  button: Boolean,
};
