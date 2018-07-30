// @flow
import type { BSONObjectId } from 'mongoose';
import type { BetTypesType } from '../../types/betTypes';

// Before players join the series they will not have many fields populated
export type InvitedPlayerType = {|
  userId: BSONObjectId,
|};

export type JoinedPlayerType = {|
  pesos: number,
  userId: BSONObjectId,
|};

export type SeriesType = {|
  betType: BetTypesType,
  createTime?: Date,
  jackpot?: number,
  players: Array<InvitedPlayerType | JoinedPlayerType>,
  round?: number,
  twoHits?: BSONObjectId,
|};
