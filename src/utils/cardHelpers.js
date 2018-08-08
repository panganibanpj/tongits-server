// @flow
import shuffle from 'lodash.shuffle';
import DECK from '../constants/DECK';
import type { CardType } from '../types/deck';

const CARDS: CardType[] = Object.keys(DECK);
// @NOTE: in a 3-player game, all players get 12 (1st gets 13)
//  this leaves 15 in pile, leading to 5 turns
//  in a 4-player game, all players get 9 (1st gets 10)
//  this leaves 15 in pile, leading to < 4 turns
const PILE_INDEX = 37;

export const shuffleCards = () => shuffle(CARDS);

export type DealtCardsType = {|
  [number]: CardType[],
  pile: CardType[],
|};
/**
 *  in: {
 *    cards: ["SA", "S2", "S3", ...],
 *    playerCount: 3,
 *  }
 *
 *  out: {
 *    "0": [...13 cards],
 *    "1": [...12 cards],
 *    "2": [...12 cards],
 *    "pile": [...rest],
 *  }
 */
export const dealCards = (playerCount: number): DealtCardsType => {
  const cards = shuffle(CARDS);
  return cards.reduce((acc, card: CardType, index) => {
    const dealTarget = index < PILE_INDEX ? index % playerCount : 'pile';
    return {
      ...acc,
      [dealTarget]: (acc[dealTarget] || []).concat(card),
    };
  }, { pile: [] });
};
