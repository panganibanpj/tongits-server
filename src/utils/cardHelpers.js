// @flow
import shuffle from 'lodash/shuffle';
import REFERENCE from '../constants/DECK';
import { RUN_MELD, SET_MELD, type MeldType } from '../constants/MELD_TYPES';
import type { CardType, DeckType } from '../types/deck';

const DECK: DeckType = REFERENCE;
const CARDS: CardType[] = Object.keys(DECK);
// @NOTE: in a 3-player game, all players get 12 (1st gets 13)
//  this leaves 15 in pile, leading to 5 turns
//  in a 4-player game, all players get 9 (1st gets 10)
//  this leaves 15 in pile, leading to < 4 turns
const PILE_INDEX = 37;

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

export const getRank = (card: CardType) => DECK[card].RANK;
const cardsAreMatchingSet = (cards: CardType[]): boolean => {
  if (!cards.length) return false;
  const tryRank = getRank(cards[0]);
  return cards.length < 5 && cards.every((card: CardType) => {
    const rank = getRank(card);
    return rank === tryRank;
  });
};
export const getSuit = (card: CardType) => DECK[card].SUIT;
const cardsAreTone = (cards: CardType[]): boolean => {
  if (!cards.length) return false;
  const trySuit = getSuit(cards[0]);
  return cards.every((card: CardType) => getSuit(card) === trySuit);
};
export const getOrder = (card: CardType) => DECK[card].ORDER;
const cardsAreStraight = (cards: CardType[]): boolean => {
  if (!cards.length) return false;
  const orders = cards.map((card: CardType) => getOrder(card));
  return Math.max(...orders) - Math.min(...orders) === cards.length - 1;
};
export const getMeldType = (cards: CardType[]): ?MeldType => {
  const safeCards: CardType[] = cards;
  if (cardsAreMatchingSet(safeCards)) return SET_MELD;
  if (cardsAreTone(safeCards) && cardsAreStraight(safeCards)) return RUN_MELD;
  return null;
};
