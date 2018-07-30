// @flow
import type { BetTypesType } from '../../types/betTypes';

// Before players join the series they will not have many fields populated
export type InvitedPlayerType = {|
  userId: MongoId,
|};

export type JoinedPlayerType = {|
  pesos: number,
  userId: MongoId,
|};

export type SeriesType = {|
  betType: BetTypesType,
  createTime?: Date,
  jackpot?: number,
  players: Array<InvitedPlayerType | JoinedPlayerType>,
  round?: number,
  twoHits?: MongoId,
|};
