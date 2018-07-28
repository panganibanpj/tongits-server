/* eslint-disable flowtype/require-variable-type */
import {
  SPADES,
  HEARTS,
  DIAMONDS,
  CLUBS,
} from './SUITS';
import {
  ACE, TWO, THREE, FOUR,
  FIVE, SIX, SEVEN, EIGHT,
  NINE, TEN, JACK, QUEEN,
  KING,
} from './RANKS';
import RANK_ORDER from './RANK_ORDER';
import RANK_VALUE from './RANK_VALUE';

const SUITS = {
  S: SPADES,
  H: HEARTS,
  D: DIAMONDS,
  C: CLUBS,
};
const RANKS = {
  A: ACE,
  /* eslint-disable quote-props */
  '2': TWO,
  '3': THREE,
  '4': FOUR,
  '5': FIVE,
  '6': SIX,
  '7': SEVEN,
  '8': EIGHT,
  '9': NINE,
  '0': TEN,
  /* eslint-enable quote-props */
  J: JACK,
  Q: QUEEN,
  K: KING,
};

export const REF = Object.keys(SUITS).reduce((acc, SUIT) => ({
  ...acc,
  ...Object.keys(RANKS).reduce((acc2, RANK) => ({
    ...acc2,
    [`${SUIT}${RANK}`]: {
      SUIT: SUITS[SUIT],
      RANK: RANKS[RANK],
      ORDER: RANK_ORDER[RANKS[RANK]],
      VALUE: RANK_VALUE[RANKS[RANK]],
    },
  }), {}),
}), {});

export const DECK = Object.keys(REF).map((CODE, INDEX) => ({
  CODE,
  INDEX,
  ...REF[CODE],
}));
