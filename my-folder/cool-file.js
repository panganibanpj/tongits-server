/*
 * See README
 */

'use strict';

const CARDS = require( './cards' );

const _flow       = require( 'lodash/fp/flow' ),
      _sampleSize = require( 'lodash/fp/sampleSize' ),
      _sortBy     = require( 'lodash/fp/sortBy' ),
      _merge      = require( 'lodash/fp/merge' ),
      _concat     = require( 'lodash/fp/concat' ),
      _filter     = require( 'lodash/fp/filter' ),
      _reduce     = require( 'lodash/fp/reduce' ),
      _isEqual    = require( 'lodash/fp/isEqual' ),
      _last       = require( 'lodash/last' ),
      _add        = require( 'lodash/fp/add' );

const createHand  = _sampleSize( 13 );
const deckIndexOf = card => CARDS.DECK.indexOf( card );
const totalValue  = _reduce((total, card) => total += card.VALUE)(0);
const createHand2 = codes => CARDS.DECK.filter( card => codes.includes( card.CODE ) );

console.info( 'Ready' );



class Meld {
  constructor( cards ) {
    if ( new.target === Meld ) {
      throw new TypeError( 'Cannot construct Meld instances directly' );
    }
    
    this.cards = cards;
    this.length = cards.length;
    this.value = totalValue( cards );
  }
  
  has( card ) {
    return this.cards.includes( card );
  }
  
  isComplete() {
    return this.length >= 3;
  }
  
  add( card ) {
    this.cards = this.cards.concat( card );
    this.length = this.cards.length;
    this.value = totalValue( this.cards );
    return this;
  }
}

class RunMeld extends Meld {
  constructor( cards ) {
    super( cards );
    this.suit = cards[ 0 ].SUIT;
  }
  
  valueWithout( card ) {
    // if run is incomplete, count all
    // if run is still complete, count 0
    // if run is partially complete, count hanging
    //  e.g. run of 3,4,5,6,7,8 without 6, count 7+8
    //  need to create new RunMelds (RunMeld of 7+8 in above example)
  }
}

class SetMeld extends Meld {
  constructor( cards ) {
    super( cards );
    this.rank = cards[ 0 ].RANK;
  }
  
  isSecret() {
    return this.cards.length === 4;
  }
  
  valueWithout( card ) {
    return this.value - card.VALUE;
  }
}

//To test, see how many times this can run in 5 seconds
function main(hand = createHand(CARDS.DECK)) {
  //const hand = createHand( CARDS.DECK );
  const orderHand = _sortBy(deckIndexOf);
  const orderedHand = orderHand(hand);

  const start = {
    lastCardIndex: NaN,
    sets: {},
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
    let melded = false;
    
    
    
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
    stats.meldReferences.set(currentCard, { run: currentRun });

    
    
    // Is current run a meld?
    if (currentRun.length === 3) {
      // Just realized is meld
      // Subtract total by current value of set minus current
      stats.total -= currentRun.value - currentCard.VALUE;
      // See if previous cards are part of set melds
      if (stats.meldReferences.get(lastCard).set.isComplete()) {
        console.info("*****CONFLICT");
      }
      if (stats.meldReferences.get(CARDS.DECK[currentCardIndex - 2]).set.isComplete()) {
        console.info("*****CONFLICT");
      }
    }
    if (currentRun.isComplete()) {
      // Subtract total by current
      // See if current card is part of set melds
      melded = true;
    }
    
    ////// Are sets secret?
    
    
    
    // Calculate current set
    var currentSet = stats.sets[currentCard.RANK];
    if (currentSet) {
      currentSet.add(currentCard);
    } else {
      currentSet = new SetMeld([currentCard]);
      stats.sets[currentCard.RANK] = currentSet;
    }
    stats.meldReferences.set(currentCard, { run: currentRun, set: currentSet });
    
    
    
    // Is current set a meld?
    if (currentSet.isComplete()) {
      // Are any cards in set also part of run melds?
      currentSet.cards.forEach(card => {
        if (card === currentCard) return;
        
        if (stats.meldReferences.get(card).run.isComplete()) {
          console.info("*****CONFLICT");
        }
      });
      
      melded = true;
    }
    
    
    
    // No meld? += total
    if (!melded) {
      stats.total += currentCard.VALUE;
      // console.info("Count", currentCard.CODE, currentCard.VALUE, stats.total);
    } else {
      // console.info("Don't count", currentCard.CODE, currentCard.VALUE, stats.total)
    }
    stats.lastCardIndex = currentCardIndex;
    
    return stats;
  }, start);

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
