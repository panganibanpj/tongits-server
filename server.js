
// Figure out fow to optimize a list of runs and sets

const reduce = require('lodash/fp/reduce');
const CARDS = require('./cards');
const totalValue  = reduce((total, card) => total += card.VALUE)(0);

class Meld {
  constructor(cards = []) {
    if (new.target === Meld) {
      throw new TypeError('Cannot construct Meld instances directly');
    }

    this.cards = cards;
    this.length = cards.length;
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
    return this;
  }
  value() {
    return this.isComplete() ? 0 : totalValue(this.cards);
  }
}
class RunMeld extends Meld {
  constructor(cards) {
    super(cards);
    if (this.cards.length) this.suit = this.cards[0].SUIT;
  }
  meldsWithout(card) {
    const cardIndex = this.cards.indexOf(card);
    const lowerRun = new RunMeld(this.cards.slice(0, cardIndex));
    const upperRun = new RunMeld(this.cards.slice(cardIndex + 1, this.cards.length));
    return [lowerRun, upperRun];
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
  meldsWithout(card) {
    return [new SetMeld(this.cards.filter(c => c !== card))];
  }
  add(card) {
    super.add(card);
    if (!this.rank) this.rank = card.RANK;
    return this;
  }
}

const testCases = [
  // No conflicts
  {
    case: 'No conflicts',
    sets: { [CARDS.RANKS.EIGHT]: ['S8', 'H8', 'C8'] },
    runs: [['C5', 'C6', 'C7']],
    expected: 0,
  },
  // run of 3, set of 3. Lowest card in run conflicts with set
  {
    case: 'run of 3, set of 3. Lowest card in run conflicts with set',
    sets: { [CARDS.RANKS.EIGHT]: ['S8', 'H8', 'C8'] },
    runs: [['C8', 'C9', 'C0']],
    expected: 16,
  },
  // run of 3, set of 3. Middle card in run conflicts with set
  {
    case: 'run of 3, set of 3. Middle card in run conflicts with set',
    sets: { [CARDS.RANKS.NINE]: ['S9', 'H9', 'C9'] },
    runs: [['C8', 'C9', 'C0']],
    expected: 18,
  },
  // run of 3, set of 3. Highest card in run conflicts with set
  {
    case: 'run of 3, set of 3. Highest card in run conflicts with set',
    sets: { [CARDS.RANKS.TEN]: ['S0', 'H0', 'C0'] },
    runs: [['C8', 'C9', 'C0']],
    expected: 17,
  },
  // run of 3, set of 4. Card in set conflict w run
  {
    case: 'run of 3, set of 4. Card in set conflict w run',
    sets: { [CARDS.RANKS.EIGHT]: ['S8', 'H8', 'C8', 'D8'] },
    runs: [['C8', 'C9', 'C0']],
    expected: 0,
  },
  // run of 4, set of 3. Lowest card in run conflict w set. 0 total
  {
    case: 'run of 4, set of 3. Lowest card in run conflict w set. 0 total',
    sets: { [CARDS.RANKS.SEVEN]: ['S7', 'H7', 'C7'] },
    runs: [['C7', 'C8', 'C9', 'C0']],
    expected: 0,
  },
  // run of 4, set of 3. Highest card in run conflict w set. 0 total
  {
    case: 'run of 4, set of 3. Highest card in run conflict w set. 0 total',
    sets: { [CARDS.RANKS.TEN]: ['S0', 'H0', 'C0'] },
    runs: [['C7', 'C8', 'C9', 'C0']],
    expected: 0,
  },
  // run of 4, set of 3. Lower-middle card in run conflict w set (count more than 1 when splitting)
  {
    case: 'run of 4, set of 3. Lower-middle card in run conflict w set (count more than 1 when splitting)',
    sets: { [CARDS.RANKS.EIGHT]: ['S8', 'H8', 'C8'] },
    runs: [['C7', 'C8', 'C9', 'C0']],
    expected: 16,
  },
  // run of 4, set of 3. Upper-middle card in run conflict w set (count more than 1 when splitting)
  {
    case: 'run of 4, set of 3. Upper-middle card in run conflict w set (count more than 1 when splitting)',
    sets: { [CARDS.RANKS.NINE]: ['S9', 'H9', 'C9'] },
    runs: [['C7', 'C8', 'C9', 'C0']],
    expected: 18,
  },
  // run of 5, set of 3. Middle card in run conflict w set (upper run complete)
  {
    case: 'run of 5, set of 3. Middle card in run conflict w set (upper run complete)',
    sets: { [CARDS.RANKS.SEVEN]: ['S7', 'H7', 'C7'] },
    runs: [['C6', 'C7', 'C8', 'C9', 'S0']],
    expected: 6,
  },
  // run of 5, set of 3. Middle card in run conflict w set (lower run complete)
  {
    case: 'run of 5, set of 3. Middle card in run conflict w set (lower run complete)',
    sets: { [CARDS.RANKS.NINE]: ['S9', 'H9', 'C9'] },
    runs: [['C6', 'C7', 'C8', 'C9', 'S0']],
    expected: 10,
  },
  // run of 7, set of 3. Middle card conflicts w set
  {
    case: 'run of 7, set of 3. Middle card conflicts w set',
    sets: { [CARDS.RANKS.SEVEN]: ['S7', 'H7', 'C7'] },
    runs: [['C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'S0']],
    expected: 0,
  },
  // multiple runs, 1 set. 2 of the cards in set conflict w lowest in runs
  {
    case: 'multiple runs, 1 set. 2 of the cards in set conflict w lowest in runs',
    sets: { [CARDS.RANKS.EIGHT]: ['S8', 'H8', 'C8'] },
    runs: [['C8', 'C9', 'C0'], ['H8', 'H9', 'H0']],
    expected: 8,
  },
  // multiple runs, 1 set. 2 of the cards in set conflict w highest in runs
  {
    case: 'multiple runs, 1 set. 2 of the cards in set conflict w highest in runs',
    sets: { [CARDS.RANKS.TEN]: ['S0', 'H0', 'C0'] },
    runs: [['C8', 'C9', 'C0'], ['H8', 'H9', 'H0']],
    expected: 10,
  },
  // multiple runs, 1 set. each card in set conflict w highest in runs
  {
    case: 'multiple runs, 1 set. each card in set conflict w highest in runs',
    sets: { [CARDS.RANKS.TEN]: ['S0', 'H0', 'C0'] },
    runs: [['C8', 'C9', 'C0'], ['H8', 'H9', 'H0'], ['S8', 'S9', 'S0']],
    expected: 0,
  },
  // multiple runs, 1 set. 2 of the cards in 4-set conflict w lowest in runs
  {
    case: 'multiple runs, 1 set. 2 of the cards in 4-set conflict w lowest in runs',
    sets: { [CARDS.RANKS.EIGHT]: ['S8', 'H8', 'C8', 'D8'] },
    runs: [['C8', 'C9', 'C0'], ['H8', 'H9', 'H0']],
    expected: 16,
  },
  // multiple runs, 1 set. 2 of the cards in 4-set conflict w highest in runs
  {
    case: 'multiple runs, 1 set. 2 of the cards in 4-set conflict w highest in runs',
    sets: { [CARDS.RANKS.TEN]: ['S0', 'H0', 'C0', 'D0'] },
    runs: [['C8', 'C9', 'C0'], ['H8', 'H9', 'H0']],
    expected: 17,
  },
  // multiple runs, 1 set. Cards in 4-set conflict w highest and lowest in runs
  {
    case: 'multiple runs, 1 set. Cards in 4-set conflict w highest and lowest in runs',
    sets: { [CARDS.RANKS.EIGHT]: ['S8', 'H8', 'C8', 'D8'] },
    runs: [['C6', 'C7', 'C8'], ['H8', 'H9', 'H0']],
    expected: 13,
  },
  // multiple runs, 1 set. Cards in 4-set conflict w highest and lowest in runs (reverse)
  {
    case: 'multiple runs, 1 set. Cards in 4-set conflict w highest and lowest in runs (reverse)',
    sets: { [CARDS.RANKS.EIGHT]: ['S8', 'H8', 'C8', 'D8'] },
    runs: [['H8', 'H9', 'H0'], ['C6', 'C7', 'C8']],
    expected: 13,
  },
  // 1 3-run, multiple sets. Lowest 2 cards in run conflict w sets
  {
    case: '1 3-run, multiple sets. Lowest 2 cards in run conflict w sets',
    sets: {
      [CARDS.RANKS.EIGHT]: ['S8', 'H8', 'C8'],
      [CARDS.RANKS.NINE]: ['S9', 'H9', 'C9'],
    },
    runs: [['C8', 'C9', 'C0']],
    expected: 10,
  },
  // 1 3-run, multiple sets. Highest 2 cards in run conflict w sets
  {
    case: '1 3-run, multiple sets. Highest 2 cards in run conflict w sets',
    sets: {
      [CARDS.RANKS.NINE]: ['S9', 'H9', 'C9'],
      [CARDS.RANKS.TEN]: ['S0', 'H0', 'C0'],
    },
    runs: [['C8', 'C9', 'C0']],
    expected: 8,
  },
  // 1 3-run, multiple sets. Highest and lowest have conflict w sets
  {
    case: '1 3-run, multiple sets. Highest and lowest have conflict w sets',
    sets: {
      [CARDS.RANKS.EIGHT]: ['S8', 'H8', 'C8'],
      [CARDS.RANKS.TEN]: ['S0', 'H0', 'C0'],
    },
    runs: [['C8', 'C9', 'C0']],
    expected: 9,
  },
  // 1 3-run, multiple sets. Each card in run conflict w sets
  {
    case: '1 3-run, multiple sets. Each card in run conflict w sets',
    sets: {
      [CARDS.RANKS.EIGHT]: ['S8', 'H8', 'C8'],
      [CARDS.RANKS.NINE]: ['S9', 'H9', 'C9'],
      [CARDS.RANKS.TEN]: ['S0', 'H0', 'C0'],
    },
    runs: [['C8', 'C9', 'C0']],
    expected: 0,
  },
  // Multiple runs + sets
  {
    case: 'Multiple runs + sets',
    sets: {
      [CARDS.RANKS.EIGHT]: ['S8', 'H8', 'C8'],
      [CARDS.RANKS.NINE]: ['S9', 'H9', 'C9'],
    },
    runs: [['C8', 'C9', 'C0'], ['S8', 'S9', 'S0']],
    expected: 17,
  },
  {
    case: 'Multiple runs + sets',
    sets: {
      [CARDS.RANKS.NINE]: ['S9', 'H9', 'C9'],
      [CARDS.RANKS.TEN]: ['S0', 'H0', 'C0'],
    },
    runs: [['C8', 'C9', 'C0'], ['S8', 'S9', 'S0']],
    expected: 16,
  },
  {
    case: 'Multiple runs + sets',
    sets: {
      [CARDS.RANKS.NINE]: ['S9', 'H9', 'C9'],
      [CARDS.RANKS.TEN]: ['S0', 'H0', 'C0'],
    },
    runs: [['C8', 'C9', 'C0', 'CJ'], ['S8', 'S9', 'S0']],
    expected: 19,
  },
  {
    case: 'Multiple runs + sets',
    sets: {
      [CARDS.RANKS.EIGHT]: ['S8', 'H8', 'C8'],
      [CARDS.RANKS.NINE]: ['S9', 'H9', 'C9'],
      [CARDS.RANKS.TEN]: ['S0', 'H0', 'C0'],
    },
    runs: [['C8', 'C9', 'C0', 'CJ'], ['S8', 'S9', 'S0', 'SJ']],
    expected: 19,
  },
  {
    case: 'Multiple runs + sets',
    sets: {
      [CARDS.RANKS.NINE]: ['S9', 'H9', 'C9'],
      [CARDS.RANKS.TEN]: ['S0', 'H0', 'C0'],
      [CARDS.RANKS.JACK]: ['SJ', 'HJ', 'CJ'],
    },
    runs: [
      ['C9', 'C0', 'CJ'],
      ['H8', 'H9', 'H0', 'HJ'],
      ['S8', 'S9', 'S0', 'SJ'],
    ],
    expected: 0,
  },
  {
    case: 'Multiple runs + sets',
    sets: {
      [CARDS.RANKS.EIGHT]: ['D8', 'H8', 'C8'],
      [CARDS.RANKS.NINE]: ['S9', 'H9', 'C9'],
    },
    runs: [
      ['S9', 'S0', 'SJ'],
      ['H8', 'H9', 'H0', 'HJ'],
    ],
    expected: 9,
  },
  {
    case: 'Multiple runs + sets',
    sets: {
      [CARDS.RANKS.EIGHT]: ['D8', 'H8', 'C8'],
      [CARDS.RANKS.NINE]: ['S9', 'H9', 'C9'],
      [CARDS.RANKS.JACK]: ['SJ', 'HJ', 'DJ'],
    },
    runs: [
      ['S9', 'S0', 'SJ'],
      ['H8', 'H9', 'H0', 'HJ'],
    ],
    expected: 19,
  },
];

const getCards = codes => codes.map(code => CARDS.DECK.find(card => card.CODE === code));
// const valueOfMelds = melds => melds.reduce((value, meld) => value + meld.value(), 0);
const countSets = sets => Object.keys(sets).length;
const printSets = sets => Object.keys(sets).map(rank => sets[rank].cards.map(card => card.CODE)).join('  ');
const printRuns = runs => runs.map(run => run.cards.map(card => card.CODE)).join('  ');


function main(testCases) {
  console.info('START');
  const stats = testCases.reduce((stats, testCase, testCaseIndex) => {
    if (testCase.skip || stats.break) return { ...stats, skipped: stats.skipped + 1, break: stats.break || testCase.break };
    // get Melds for sets and runs
    const setMelds = Object.keys(testCase.sets).reduce((sets, rank) => ({ ...sets, [rank]: new SetMeld(getCards(testCase.sets[rank])) }), {});
    const runMelds = testCase.runs.map(run => new RunMeld(getCards(run)));

    function test({ sets, runs }) {
      let total = 0;
      for (let runIndex = 0; runIndex < runs.length; runIndex++) {
        let run = runs[runIndex];
        for (let cardIndex = 0; cardIndex < run.cards.length; cardIndex++) {
          let card = run.cards[cardIndex];
          let setForRank = sets[card.RANK];
          if (setForRank && setForRank.has(card)) {
            return Math.min(
              test({
                sets,
                runs: (runIndex === 0 ? [] : runs.slice(0, runIndex)).concat(
                  run.meldsWithout(card),
                  runs.slice(runIndex + 1),
                ),
              }),
              test({
                runs,
                sets: {
                  ...sets,
                  [card.RANK]: setForRank.meldsWithout(card)[0],
                },
              })
            );
          } else if (!run.isComplete()) {
            total += card.VALUE;
          }
        }
      }
      const incompleteSetsValue = Object.keys(sets).reduce((total, rank) => total + sets[rank].value(), 0);
      return total + incompleteSetsValue;
    }

    const total = test({ sets: setMelds, runs: runMelds });
    if (total !== testCase.expected) {
      console.info(`Failure!
        testCase ${testCaseIndex}: ${testCase.case}
        sets(${countSets(setMelds)}): ${printSets(setMelds)}
        runs(${runMelds.length}): ${printRuns(runMelds)}
        expected: ${testCase.expected}
        total: ${total}
      `);
      return { ...stats, failing: stats.failing + 1, break: stats.break || testCase.break };
    }
    return { ...stats, passing: stats.passing + 1, break: stats.break || testCase.break };
  }, {
    passing: 0,
    failing: 0,
    skipped: 0,
  });
  delete stats.break;
  console.info('DONE!', stats);
}

// main([testCases[26]]); /*
main(testCases); // */
