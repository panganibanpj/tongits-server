// @flow
import type { BSONObjectId } from 'mongoose';
import type { CardType } from '../../types/deck';

// Before players join the match they will not have many fields populated
export type InvitedPlayerType = {
  userId: BSONObjectId,
};

export type JoinedPlayerType = {|
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

export type MatchType = {|
  better?: BSONObjectId,
  button?: boolean,
  createTime?: Date,
  endTime?: Date,
  jackpot?: number,
  pile?: Array<CardType>,
  players: Array<InvitedPlayerType | JoinedPlayerType>,
  round?: number,
  seriesId: BSONObjectId,
  startTime?: ?Date,
  turn?: number,
  turnEnded?: boolean,
  turnStarted?: boolean,
  winner?: BSONObjectId,
|};
