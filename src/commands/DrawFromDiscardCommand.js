// @flow
import type { ObjectId } from 'mongoose';
import Match from '../models/MatchModel';
import {
  MatchNotFoundError,
  MatchNotStartedError,
  MatchAlreadyEndedError,
  NotEnoughCardsError,
  PlayerNotActiveError,
  TurnAlreadyStartedError,
  PlayerDoesNotHaveCards,
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

    const match = await Match.findById(matchId);
    if (!match) throw new MatchNotFoundError(matchId);
    if (!match.hasStarted) throw new MatchNotStartedError(matchId);
    if (match.hasEnded) throw new MatchAlreadyEndedError(matchId);
    if (match.turnStarted) {
      throw new TurnAlreadyStartedError(matchId, match.turn || 0);
    }
    if (!match.isActivePlayer(userId)) {
      throw new PlayerNotActiveError(matchId, userId, match.turn || 0);
    }
    if (!match.playerHasCards(userId, partialMeld)) {
      throw new PlayerDoesNotHaveCards(
        matchId,
        userId,
        partialMeld,
        match.turn || 0,
      );
    }
    const discard = match.lastDiscard;
    if (!discard) throw new NoDiscardedCard(matchId, match.turn || 0);
    const meld = partialMeld.concat(discard);
    const meldType = getMeldType(meld);
    if (!meldType) throw new CardsAreNotMeldError(meld);

    await match.acceptDiscard(partialMeld, meldType);
  }
}
