// @flow
import type { ObjectId } from 'mongoose';
import { fetchAndValidateMatch } from './commandHelpers';
import type { CardType } from '../types/deck';

export default class DiscardCommand {
  matchId: ObjectId;
  userId: ObjectId;
  discard: CardType;

  constructor(matchId: ObjectId, userId: ObjectId, discard: CardType) {
    this.matchId = matchId;
    this.userId = userId;
    this.discard = discard;
  }

  async execute() {
    const { matchId, userId, discard } = this;

    const match = await fetchAndValidateMatch(matchId, {
      activePlayerUserId: userId,
      cardsInActiveHand: [discard],
      turnStarted: true,
    });

    await match.discard(discard);
  }
}
