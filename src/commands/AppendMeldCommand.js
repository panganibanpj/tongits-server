// @flow
import type { ObjectId } from 'mongoose';
import { fetchAndValidateMatch } from './commandHelpers';
import { validMeld } from '../utils/cardHelpers';
import { PlayersNotInMatchError, CardsAreNotMeldError } from '../utils/errors';
import type { CardType } from '../types/deck';

export class PlayerMissingMeldInMatch extends RangeError {
  constructor(matchId: ObjectId, userId: ObjectId, meld: CardType[]) {
    super(`Player "${
      userId.toString()
    }" does not have meld "${
      meld.join('","')
    }" in match "${
      matchId.toString()
    }"`);
  }
}

export default class AppendMeldCommand {
  matchId: ObjectId;
  userId: ObjectId;
  targetUserId: ObjectId;
  targetMeld: CardType[];
  cardsToAppend: CardType[];

  constructor(
    matchId: ObjectId,
    userId: ObjectId,
    targetUserId: ObjectId,
    targetMeld: CardType[],
    cardsToAppend: CardType[],
  ) {
    const tryMeld = targetMeld.concat(cardsToAppend);
    if (!validMeld(tryMeld)) throw new CardsAreNotMeldError(tryMeld);

    this.matchId = matchId;
    this.userId = userId;
    this.targetUserId = targetUserId;
    this.targetMeld = targetMeld;
    this.cardsToAppend = cardsToAppend;
  }

  async execute() {
    const {
      matchId,
      userId,
      targetUserId,
      targetMeld,
      cardsToAppend,
    } = this;

    const match = await fetchAndValidateMatch(matchId, {
      activePlayerUserId: userId,
      cardsInActiveHand: cardsToAppend,
      turnStarted: true,
    });
    if (!match.hasPlayer(targetUserId)) {
      throw new PlayersNotInMatchError([targetUserId], matchId);
    }
    if (!match.playerHasMeld(targetUserId, targetMeld)) {
      throw new PlayerMissingMeldInMatch(matchId, targetUserId, targetMeld);
    }

    await match.appendToMeld(userId, cardsToAppend, targetUserId, targetMeld);
  }
}
