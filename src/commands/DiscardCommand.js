// @flow
import type { ObjectId } from 'mongoose';
import Match from '../models/MatchModel';
import { playerHasCardsInMatch } from './commandHelpers';
import { TurnNotYetStartedError } from '../utils/errors';
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
    const match = playerHasCardsInMatch({
      match: await Match.findById(matchId),
      userId,
      cards: [discard],
      matchId,
    });
    if (!match.turnStarted) {
      throw new TurnNotYetStartedError(matchId, match.turn || 0);
    }

    await match.discard(discard);
  }
}
