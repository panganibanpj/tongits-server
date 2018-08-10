// @flow
import type { ObjectId } from 'mongoose';
import Match from '../models/MatchModel';
import {
  MatchNotFoundError,
  MatchNotStartedError,
  MatchAlreadyEndedError,
  PlayerNotActiveError,
} from '../utils/errors';

export class TurnAlreadyStartedError extends Error {
  constructor(matchId: ObjectId, turn: number) {
    super(`Turn ${turn} already started for match "${matchId.toString()}"`);
  }
}

export default class DrawCardCommand {
  matchId: ObjectId;
  userId: ObjectId;

  constructor(matchId: ObjectId, userId: ObjectId) {
    this.matchId = matchId;
    this.userId = userId;
  }

  async execute() {
    const { matchId, userId } = this;

    const match = await Match.findById(matchId);
    if (!match) throw new MatchNotFoundError(matchId);
    if (!match.hasStarted) throw new MatchNotStartedError(matchId);
    if (match.hasEnded) throw new MatchAlreadyEndedError(matchId);
    if (match.turnStarted) {
      throw new TurnAlreadyStartedError(matchId, match.turn || 0);
    }
    if (!match.isActivePlayer(userId)) {
      throw new PlayerNotActiveError(matchId, userId);
    }

    await match.drawCard();
  }
}
