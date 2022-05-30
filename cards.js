'use strict';

const SUITS = {
    SPADES: 'Cards.Suits.Spades',
    HEARTS: 'Cards.Suits.Hearts',
    DIAMONDS: 'Cards.Suits.Diamonds',
    CLUBS: 'Cards.Suits.Clubs'
};

const RANKS = {
    ACE: 'Cards.Ranks.Ace',
    TWO: 'Cards.Ranks.Two',
    THREE: 'Cards.Ranks.Three',
    FOUR: 'Cards.Ranks.Four',
    FIVE: 'Cards.Ranks.Five',
    SIX: 'Cards.Ranks.Six',
    SEVEN: 'Cards.Ranks.Seven',
    EIGHT: 'Cards.Ranks.Eight',
    NINE: 'Cards.Ranks.Nine',
    TEN: 'Cards.Ranks.Ten',
    JACK: 'Cards.Ranks.Jack',
    QUEEN: 'Cards.Ranks.Queen',
    KING: 'Cards.Ranks.King'
};

const ORDERS = {
    ACE:   0,
    TWO:   1,
    THREE: 2,
    FOUR:  3,
    FIVE:  4,
    SIX:   5,
    SEVEN: 6,
    EIGHT: 7,
    NINE:  8,
    TEN:   9,
    JACK:  10,
    QUEEN: 11,
    KING:  12
};

const VALUES = {
    ACE:   1,
    TWO:   2,
    THREE: 3,
    FOUR:  4,
    FIVE:  5,
    SIX:   6,
    SEVEN: 7,
    EIGHT: 8,
    NINE:  9,
    TEN:   10,
    JACK:  10,
    QUEEN: 10,
    KING:  10
};

const REF = {
    "SA": {
        "SUIT": SUITS.SPADES,
        "RANK": RANKS.ACE,
        "ORDER": ORDERS.ACE,
        "VALUE": VALUES.ACE
    },
    "S2": {
        "SUIT": SUITS.SPADES,
        "RANK": RANKS.TWO,
        "ORDER": ORDERS.TWO,
        "VALUE": VALUES.TWO
    },
    "S3": {
        "SUIT": SUITS.SPADES,
        "RANK": RANKS.THREE,
        "ORDER": ORDERS.THREE,
        "VALUE": VALUES.THREE
    },
    "S4": {
        "SUIT": SUITS.SPADES,
        "RANK": RANKS.FOUR,
        "ORDER": ORDERS.FOUR,
        "VALUE": VALUES.FOUR
    },
    "S5": {
        "SUIT": SUITS.SPADES,
        "RANK": RANKS.FIVE,
        "ORDER": ORDERS.FIVE,
        "VALUE": VALUES.FIVE
    },
    "S6": {
        "SUIT": SUITS.SPADES,
        "RANK": RANKS.SIX,
        "ORDER": ORDERS.SIX,
        "VALUE": VALUES.SIX
    },
    "S7": {
        "SUIT": SUITS.SPADES,
        "RANK": RANKS.SEVEN,
        "ORDER": ORDERS.SEVEN,
        "VALUE": VALUES.SEVEN
    },
    "S8": {
        "SUIT": SUITS.SPADES,
        "RANK": RANKS.EIGHT,
        "ORDER": ORDERS.EIGHT,
        "VALUE": VALUES.EIGHT
    },
    "S9": {
        "SUIT": SUITS.SPADES,
        "RANK": RANKS.NINE,
        "ORDER": ORDERS.NINE,
        "VALUE": VALUES.NINE
    },
    "S0": {
        "SUIT": SUITS.SPADES,
        "RANK": RANKS.TEN,
        "ORDER": ORDERS.TEN,
        "VALUE": VALUES.TEN
    },
    "SJ": {
        "SUIT": SUITS.SPADES,
        "RANK": RANKS.JACK,
        "ORDER": ORDERS.JACK,
        "VALUE": VALUES.JACK
    },
    "SQ": {
        "SUIT": SUITS.SPADES,
        "RANK": RANKS.QUEEN,
        "ORDER": ORDERS.QUEEN,
        "VALUE": VALUES.QUEEN
    },
    "SK": {
        "SUIT": SUITS.SPADES,
        "RANK": RANKS.KING,
        "ORDER": ORDERS.KING,
        "VALUE": VALUES.KING
    },
    "HA": {
        "SUIT": SUITS.HEARTS,
        "RANK": RANKS.ACE,
        "ORDER": ORDERS.ACE,
        "VALUE": VALUES.ACE
    },
    "H2": {
        "SUIT": SUITS.HEARTS,
        "RANK": RANKS.TWO,
        "ORDER": ORDERS.TWO,
        "VALUE": VALUES.TWO
    },
    "H3": {
        "SUIT": SUITS.HEARTS,
        "RANK": RANKS.THREE,
        "ORDER": ORDERS.THREE,
        "VALUE": VALUES.THREE
    },
    "H4": {
        "SUIT": SUITS.HEARTS,
        "RANK": RANKS.FOUR,
        "ORDER": ORDERS.FOUR,
        "VALUE": VALUES.FOUR
    },
    "H5": {
        "SUIT": SUITS.HEARTS,
        "RANK": RANKS.FIVE,
        "ORDER": ORDERS.FIVE,
        "VALUE": VALUES.FIVE
    },
    "H6": {
        "SUIT": SUITS.HEARTS,
        "RANK": RANKS.SIX,
        "ORDER": ORDERS.SIX,
        "VALUE": VALUES.SIX
    },
    "H7": {
        "SUIT": SUITS.HEARTS,
        "RANK": RANKS.SEVEN,
        "ORDER": ORDERS.SEVEN,
        "VALUE": VALUES.SEVEN
    },
    "H8": {
        "SUIT": SUITS.HEARTS,
        "RANK": RANKS.EIGHT,
        "ORDER": ORDERS.EIGHT,
        "VALUE": VALUES.EIGHT
    },
    "H9": {
        "SUIT": SUITS.HEARTS,
        "RANK": RANKS.NINE,
        "ORDER": ORDERS.NINE,
        "VALUE": VALUES.NINE
    },
    "H0": {
        "SUIT": SUITS.HEARTS,
        "RANK": RANKS.TEN,
        "ORDER": ORDERS.TEN,
        "VALUE": VALUES.TEN
    },
    "HJ": {
        "SUIT": SUITS.HEARTS,
        "RANK": RANKS.JACK,
        "ORDER": ORDERS.JACK,
        "VALUE": VALUES.JACK
    },
    "HQ": {
        "SUIT": SUITS.HEARTS,
        "RANK": RANKS.QUEEN,
        "ORDER": ORDERS.QUEEN,
        "VALUE": VALUES.QUEEN
    },
    "HK": {
        "SUIT": SUITS.HEARTS,
        "RANK": RANKS.KING,
        "ORDER": ORDERS.KING,
        "VALUE": VALUES.KING
    },
    "DA": {
        "SUIT": SUITS.DIAMONDS,
        "RANK": RANKS.ACE,
        "ORDER": ORDERS.ACE,
        "VALUE": VALUES.ACE
    },
    "D2": {
        "SUIT": SUITS.DIAMONDS,
        "RANK": RANKS.TWO,
        "ORDER": ORDERS.TWO,
        "VALUE": VALUES.TWO
    },
    "D3": {
        "SUIT": SUITS.DIAMONDS,
        "RANK": RANKS.THREE,
        "ORDER": ORDERS.THREE,
        "VALUE": VALUES.THREE
    },
    "D4": {
        "SUIT": SUITS.DIAMONDS,
        "RANK": RANKS.FOUR,
        "ORDER": ORDERS.FOUR,
        "VALUE": VALUES.FOUR
    },
    "D5": {
        "SUIT": SUITS.DIAMONDS,
        "RANK": RANKS.FIVE,
        "ORDER": ORDERS.FIVE,
        "VALUE": VALUES.FIVE
    },
    "D6": {
        "SUIT": SUITS.DIAMONDS,
        "RANK": RANKS.SIX,
        "ORDER": ORDERS.SIX,
        "VALUE": VALUES.SIX
    },
    "D7": {
        "SUIT": SUITS.DIAMONDS,
        "RANK": RANKS.SEVEN,
        "ORDER": ORDERS.SEVEN,
        "VALUE": VALUES.SEVEN
    },
    "D8": {
        "SUIT": SUITS.DIAMONDS,
        "RANK": RANKS.EIGHT,
        "ORDER": ORDERS.EIGHT,
        "VALUE": VALUES.EIGHT
    },
    "D9": {
        "SUIT": SUITS.DIAMONDS,
        "RANK": RANKS.NINE,
        "ORDER": ORDERS.NINE,
        "VALUE": VALUES.NINE
    },
    "D0": {
        "SUIT": SUITS.DIAMONDS,
        "RANK": RANKS.TEN,
        "ORDER": ORDERS.TEN,
        "VALUE": VALUES.TEN
    },
    "DJ": {
        "SUIT": SUITS.DIAMONDS,
        "RANK": RANKS.JACK,
        "ORDER": ORDERS.JACK,
        "VALUE": VALUES.JACK
    },
    "DQ": {
        "SUIT": SUITS.DIAMONDS,
        "RANK": RANKS.QUEEN,
        "ORDER": ORDERS.QUEEN,
        "VALUE": VALUES.QUEEN
    },
    "DK": {
        "SUIT": SUITS.DIAMONDS,
        "RANK": RANKS.KING,
        "ORDER": ORDERS.KING,
        "VALUE": VALUES.KING
    },
    "CA": {
        "SUIT": SUITS.CLUBS,
        "RANK": RANKS.ACE,
        "ORDER": ORDERS.ACE,
        "VALUE": VALUES.ACE
    },
    "C2": {
        "SUIT": SUITS.CLUBS,
        "RANK": RANKS.TWO,
        "ORDER": ORDERS.TWO,
        "VALUE": VALUES.TWO
    },
    "C3": {
        "SUIT": SUITS.CLUBS,
        "RANK": RANKS.THREE,
        "ORDER": ORDERS.THREE,
        "VALUE": VALUES.THREE
    },
    "C4": {
        "SUIT": SUITS.CLUBS,
        "RANK": RANKS.FOUR,
        "ORDER": ORDERS.FOUR,
        "VALUE": VALUES.FOUR
    },
    "C5": {
        "SUIT": SUITS.CLUBS,
        "RANK": RANKS.FIVE,
        "ORDER": ORDERS.FIVE,
        "VALUE": VALUES.FIVE
    },
    "C6": {
        "SUIT": SUITS.CLUBS,
        "RANK": RANKS.SIX,
        "ORDER": ORDERS.SIX,
        "VALUE": VALUES.SIX
    },
    "C7": {
        "SUIT": SUITS.CLUBS,
        "RANK": RANKS.SEVEN,
        "ORDER": ORDERS.SEVEN,
        "VALUE": VALUES.SEVEN
    },
    "C8": {
        "SUIT": SUITS.CLUBS,
        "RANK": RANKS.EIGHT,
        "ORDER": ORDERS.EIGHT,
        "VALUE": VALUES.EIGHT
    },
    "C9": {
        "SUIT": SUITS.CLUBS,
        "RANK": RANKS.NINE,
        "ORDER": ORDERS.NINE,
        "VALUE": VALUES.NINE
    },
    "C0": {
        "SUIT": SUITS.CLUBS,
        "RANK": RANKS.TEN,
        "ORDER": ORDERS.TEN,
        "VALUE": VALUES.TEN
    },
    "CJ": {
        "SUIT": SUITS.CLUBS,
        "RANK": RANKS.JACK,
        "ORDER": ORDERS.JACK,
        "VALUE": VALUES.JACK
    },
    "CQ": {
        "SUIT": SUITS.CLUBS,
        "RANK": RANKS.QUEEN,
        "ORDER": ORDERS.QUEEN,
        "VALUE": VALUES.QUEEN
    },
    "CK": {
        "SUIT": SUITS.CLUBS,
        "RANK": RANKS.KING,
        "ORDER": ORDERS.KING,
        "VALUE": VALUES.KING
    }
};

module.exports = Object.freeze({
    RANKS,
    DECK: Object.keys(REF).map((CODE, INDEX) => Object.assign({ CODE, INDEX }, REF[CODE]))
    // REF: REF
});
