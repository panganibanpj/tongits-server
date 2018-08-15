// @flow
import DECK from '../constants/DECK';

type SuitsType =
  | 'SPADES'
  | 'HEARTS'
  | 'DIAMONDS'
  | 'CLUBS';
export type RankType =
  | 'ACE'
  | 'TWO'
  | 'THREE'
  | 'FOUR'
  | 'FIVE'
  | 'SIX'
  | 'SEVEN'
  | 'EIGHT'
  | 'NINE'
  | 'TEN'
  | 'JACK'
  | 'QUEEN'
  | 'KING';
export type CardRefType = {|
  ORDER: number,
  RANK: RankType,
  SUIT: SuitsType,
  VALUE: number,
|};
export type DeckType = { [string]: CardRefType };
export type CardType = $Keys<typeof DECK>;
