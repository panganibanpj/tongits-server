// @flow
import type { ObjectId } from 'mongoose';
import fetchAndValidateMatch from './commandHelpers';

export class PlayerHasNoMeldsError extends Error {
  constructor(matchId: ObjectId, userId: ObjectId) {
    super(
      `Player ${userId.toString()} has no melds in match ${matchId.toString()}`,
    );
  }
}

export class PlayerIsBlockedError extends Error {
  constructor(matchId: ObjectId, userId: ObjectId) {
    super(
      `Player ${userId.toString()} is blocked in match ${matchId.toString()}`,
    );
  }
}

export default class BetCommand {
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
    if (!match.playerHasMelds(userId)) {
      throw new PlayerHasNoMeldsError(matchId, userId);
    }
    if (match.playerIsBlocked(userId)) {
      throw new PlayerIsBlockedError(matchId, userId);
    }

    await match.bet();
  }
}
