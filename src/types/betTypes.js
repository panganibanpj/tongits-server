// @flow
import BET_TYPES from '../constants/BET_TYPES';

export type BetType = {|
  ACES: number,
  ANTE: number,
  CALL_BET: number,
  FIRST_ANTE: number,
  FOLD_BET: number,
  LAST_BUNOT: number,
  SECRET: number,
  TONG_ITS: number,
|};
export type BetTypesType = $Keys<typeof BET_TYPES>;
