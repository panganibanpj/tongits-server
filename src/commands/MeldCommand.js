// @flow
import type { ObjectId } from 'mongoose';
import fetchAndValidateMatch from './commandHelpers';
import { getMeldType } from '../utils/cardHelpers';
import { NotEnoughCardsError, CardsAreNotMeldError } from '../utils/errors';
import type { CardType } from '../types/deck';

export default class MeldCommand {
  matchId: ObjectId;
  userId: ObjectId;
  meld: CardType[];

  constructor(matchId: ObjectId, userId: ObjectId, meld: CardType[]) {
    if (meld.length < 3) throw new NotEnoughCardsError(meld, 3);

    this.matchId = matchId;
    this.userId = userId;
    this.meld = meld;
  }

  async execute() {
    const { matchId, userId, meld } = this;

    const match = await fetchAndValidateMatch(matchId, {
      activePlayerUserId: userId,
      cardsInActiveHand: meld,
      turnStarted: true,
    });

    const meldType = getMeldType(meld);
    if (!meldType) throw new CardsAreNotMeldError(meld);

    await match.layDownMeld(meld, meldType);
  }
}
