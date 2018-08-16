// @flow
import type { ObjectId } from 'mongoose';
import { fetchAndValidateMatch } from './commandHelpers';
import {
  NotEnoughCardsError,
  CardsAreNotMeldError,
} from '../utils/errors';
import { getMeldType } from '../utils/cardHelpers';
import type { CardType } from '../types/deck';

export class NoDiscardedCard extends RangeError {
  constructor(matchId: ObjectId, turn: number) {
    super(`No discarded card for match ${matchId.toString()} at turn ${turn}`);
  }
}

export default class DrawFromDiscardCommand {
  matchId: ObjectId;
  userId: ObjectId;
  partialMeld: CardType[];

  constructor(matchId: ObjectId, userId: ObjectId, partialMeld: CardType[]) {
    if (partialMeld.length < 2) throw new NotEnoughCardsError(partialMeld, 2);

    this.matchId = matchId;
    this.userId = userId;
    this.partialMeld = partialMeld;
  }

  async execute() {
    const { matchId, userId, partialMeld } = this;

    const match = await fetchAndValidateMatch(matchId, {
      activePlayerUserId: userId,
      cardsInActiveHand: partialMeld,
      turnStarted: false,
    });

    const discard = match.lastDiscard;
    if (!discard) throw new NoDiscardedCard(matchId, match.turn || 0);
    const meld = partialMeld.concat(discard);
    const meldType = getMeldType(meld);
    if (!meldType) throw new CardsAreNotMeldError(meld);

    await match.acceptDiscard(partialMeld, meldType);
  }
}
