// @flow
import type { ObjectId } from 'mongoose';
import fetchAndValidateMatch from './commandHelpers';

export default class DrawFromPileCommand {
  matchId: ObjectId;
  userId: ObjectId;

  constructor(matchId: ObjectId, userId: ObjectId) {
    this.matchId = matchId;
    this.userId = userId;
  }

  async execute() {
    const { matchId, userId } = this;

    const match = await fetchAndValidateMatch(matchId, {
      activePlayerUserId: userId,
      turnStarted: false,
    });

    await match.drawCard();
  }
}
