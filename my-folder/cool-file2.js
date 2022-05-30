/*
 * See README
 */

'use strict';

const CARDS = require( './cards' );

const _flow = require('lodash/fp/flow');
const _sampleSize = require('lodash/fp/sampleSize');
const _sortBy = require('lodash/fp/sortBy');
const _merge = require('lodash/fp/merge');
const _concat = require('lodash/fp/concat');
const _filter = require('lodash/fp/filter');
const _reduce = require('lodash/fp/reduce');
const _isEqual = require('lodash/fp/isEqual');
const _last = require('lodash/last');
const _add = require('lodash/fp/add');

const createHand  = _sampleSize(13);
const deckIndexOf = card => CARDS.DECK.indexOf(card);
const totalValue  = _reduce((total, card) => total += card.VALUE)(0);
const createHand2 = codes => CARDS.DECK.filter(card => codes.includes(card.CODE));

console.info( 'Ready' );



class Meld {
  constructor(cards = []) {
    if (new.target === Meld) {
      throw new TypeError('Cannot construct Meld instances directly');
    }
    
    this.cards = cards;
    this.length = cards.length;
    this.value = totalValue(cards);
  }
  
  has(card) {
    return this.cards.includes(card);
  }
  
  isComplete() {
    return this.length >= 3;
  }
  
  add(card) {
    this.cards = this.cards.concat(card);
    this.length = this.cards.length;
    this.value = totalValue(this.cards);
    return this;
  }
}

class RunMeld extends Meld {
  constructor(cards) {
    super(cards);
    if (this.cards.length) this.suit = this.cards[0].SUIT;
  }
  
  valueWithout(card) {
    const testRun = new RunMeld(this.cards.filter(testCard => testCard !== card));
    // if run is incomplete, count all
    if (testRun.isComplete()) return 0;
    // if run is still complete, count 0
    else return testRun.value;
    // if run is partially complete, count hanging
    //  e.g. run of 3,4,5,6,7,8 without 6, count 7+8
    //  need to create new RunMelds (RunMeld of 7+8 in above example)
  }
  
  add(card) {
    super.add(card);
    if (!this.suit) this.suit = card.SUIT;
  }
}

class SetMeld extends Meld {
  constructor(cards) {
    super(cards);
    if (this.cards.length) this.rank = this.cards[0].RANK;
  }
  
  isSecret() {
    return this.cards.length === 4;
  }
  
  valueWithout(card) {
    return this.value - card.VALUE;
  }
  
  add(card) {
    super.add(card);
    if (!this.rank) this.rank = card.RANK;
    return this;
  }
}

//To test, see how many times this can run in 5 seconds
function main(hand = createHand(CARDS.DECK)) {
  //const hand = createHand( CARDS.DECK );
  const orderHand = _sortBy(deckIndexOf);
  const orderedHand = orderHand(hand);

  const setMelds = orderedHand.reduce((setMelds, currentCard) => {
    const meldForRank = setMelds[currentCard.RANK] || new SetMeld();
    return {
      ...setMelds,
      [currentCard.RANK]: meldForRank.add(currentCard),
    };
  }, {});
  
  // console.info(setMelds);

  const start = {
    lastCardIndex: NaN,
    sets: setMelds,
    runs: [],
    meldReferences: new Map(),
    total: 0
  };

  /*
   * stats: Object
   *  lastCardIndex: int - Deck index of the last card iterated
   *  sets: Object<String, array<SetMeld>> - Keys are card.RANK, values are array of Card. SetMelds can be incomplete (< 3 cards in set)
   *  runs: array<RunMeld> - All runs collected. Even if run is not complete (< 3 cards in run)
   *  total: int - Running total of hand value
   */
  
  const stats = orderedHand.reduce((stats, currentCard) => {
    const lastCard = CARDS.DECK[stats.lastCardIndex] || {};
    // let melded = false;
    
    
    
    // Calculate current run. Append if continue from last card, else start new
    const currentCardIndex = deckIndexOf(currentCard);
    const proceedsLastCard = stats.lastCardIndex + 1 === currentCardIndex;
    const sameSuit = lastCard.SUIT === currentCard.SUIT;
    const alreadyOnRun = proceedsLastCard && sameSuit;
    
    let currentRun;
    if (alreadyOnRun) {
      currentRun = _last(stats.runs);
      currentRun.add(currentCard);
    } else {
      currentRun = new RunMeld([currentCard]);
      stats.runs.push(currentRun);
    }
    stats.meldReferences.set(currentCard, { run: currentRun, set: setMelds[currentCard.RANK] });
    
    // // Is current run a meld?
    // if (currentRun.length === 3) {
    //   // Just realized is meld
    //   // Subtract total by current value of set minus current
    //   stats.total -= currentRun.value - currentCard.VALUE;
    //   // See if previous cards are part of set melds
    //   if (stats.meldReferences.get(lastCard).set.isComplete()) {
    //     console.info("*****CONFLICT");
    //   }
    //   if (stats.meldReferences.get(CARDS.DECK[currentCardIndex - 2]).set.isComplete()) {
    //     console.info("*****CONFLICT");
    //   }
    // }
    // if (currentRun.isComplete()) {
    //   // Subtract total by current
    //   // See if current card is part of set melds
    //   melded = true;
    // }
    stats.lastCardIndex = currentCardIndex;
    return stats;
  }, start);

  stats.total = orderedHand.reduce((total, currentCard) => {
    const refs = stats.meldReferences.get(currentCard);
    if (refs.run.isComplete() || refs.set.isComplete()) {
      if (refs.run.isComplete() && refs.set.isComplete()) {
        const runValue = refs.run.valueWithout(currentCard);
        const setValue = refs.set.valueWithout(currentCard);
        if (runValue < setValue) {
          return total + setValue;
          // set should no longer be considered complete
        } else {
          return total + runValue;
          // run should no longer be considered complete
        }
      };
      return total;
    } else return total + currentCard.VALUE;
  }, 0);
  
  // console.info('orderedHand', orderedHand);
  // console.info('hand', orderedHand.map(card=>card.CODE).join())
  // console.info('stats', stats);
    console.info('runs', stats.runs.reduce((count, run)=>count+=(run.isComplete()?1:0),0));
    console.info('sets', Object.keys(stats.sets).map(setKey=>stats.sets[setKey]).reduce((count, set)=>count+=(set.isComplete()?1:0),0));
  console.info('total', stats.total);
}

const testData = require('./test-data');
testData.forEach(test => {
  console.info("\n\n\ntest", test.cards);
  main(createHand2(test.cards.split(',')));
  console.info("******Expected: " + test.total);
});
