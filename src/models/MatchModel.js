// @flow
import mongoose, { Schema, type BSONObjectId } from 'mongoose';
import { CreateTime, NaturalNumber, User } from '../util/model-helpers';
import { COLLECTION_NAME as Series } from './SeriesModel';
import type { CardType } from '../types/deck';

// Players to add to match
// Type used to validate player shape when constructing or adding new players to match
type ConstructorPlayerType = {|
  bet?: boolean,
  blockedTurns?: number,
  discard?: Array<CardType>,
  hand?: Array<CardType>,
  joinTime?: Date,
  melds?: {|
    runs?: Array<CardType>,
    sets?: { [string]: Array<CardType> },
  |},
  pesos?: number,
  userId: BSONObjectId,
|};

export type MatchType = {|
  better?: BSONObjectId,
  button: boolean,
  createTime: Date,
  endTime?: Date,
  jackpot?: number,
  pile: Array<CardType>,
  players: Array<ConstructorPlayerType>,
  round: number,
  seriesId: BSONObjectId,
  startTime: ?Date,
  turn?: number,
  turnEnded: boolean,
  turnStarted: boolean,
  winner?: BSONObjectId,
|};

const Cards = [{
  type: String,
  match: /[SHDC][A2-90JQK]/,
}];

const schema = new Schema({
  seriesId: {
    type: Schema.Types.ObjectId,
    ref: Series,
    required: true,
  },
  round: NaturalNumber,
  better: User,
  createTime: CreateTime,
  startTime: Date, // inidicator that game has started
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
      pesos: NaturalNumber, // pesos count for this series
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
});

// Players already added to match
// Type used to validate access of player properties
type ExistingPlayerType = {|
  bet: boolean,
  blockedTurns: number,
  discard: Array<CardType>,
  hand: Array<CardType>,
  joinTime: Date,
  melds: {|
    runs: Array<CardType>,
    sets: { [string]: Array<CardType> },
  |},
  pesos: number,
  userId: BSONObjectId,
|};

schema.loadClass(class Match /* :: extends Mongoose$Document */ {
  seriesId: BSONObjectId;
  round: number;
  better: ?BSONObjectId;
  createTime: Date;
  startTime: ?Date;
  endTime: ?Date;
  winner: ?BSONObjectId;
  jackpot: ?number;
  turn: ?number;
  pile: Array<CardType>;
  turnStarted: boolean;
  turnEnded: boolean;
  players: Array<ExistingPlayerType>;
  button: boolean;
});

export const COLLECTION_NAME = 'match';
export default mongoose.model(COLLECTION_NAME, schema);
