// @flow
import type { ObjectId } from 'mongoose';
import type { CardType } from '../types/deck';

const str = (userId: ObjectId | ObjectId[]) => (
  (Array.isArray(userId) ? userId[0] : userId).toString()
);

export class UserNotFoundError extends RangeError {
  constructor(userId: ObjectId | ObjectId[]) {
    super(`Cannot find one of user: "${
      Array.isArray(userId) ? userId.join('", "') : userId.toString()
    }"`);
  }
}

export class SeriesNotFoundError extends RangeError {
  constructor(seriesId: ObjectId) {
    super(`Cannot find series: "${seriesId.toString()}"`);
  }
}

export class MatchNotFoundError extends RangeError {
  constructor(matchId: ObjectId) {
    super(`Cannot find match: "${matchId.toString()}"`);
  }
}

export class NotEnoughPlayersError extends RangeError {
  constructor() {
    super('Requires at least 1 player');
  }
}

export class MatchAlreadyStartedError extends RangeError {
  constructor(matchId: ObjectId) {
    super(`Match already started: "${matchId.toString()}"`);
  }
}

export class PlayersNotInMatchError extends RangeError {
  constructor(userIds: ObjectId[], matchId: ObjectId) {
    super(
      `One of user "${userIds.join('", "')}" not in match "${str(matchId)}"`,
    );
  }
}

export class MatchNotStartedError extends RangeError {
  constructor(matchId: ObjectId) {
    super(`Match not yet started: "${matchId.toString()}"`);
  }
}

export class PlayerNotActiveError extends RangeError {
  constructor(matchId: ObjectId, userId: ObjectId, turn: number) {
    super(`Player "${
      userId.toString()
    }" not the active player in match "${
      matchId.toString()
    }" at turn ${turn}`);
  }
}

export class MatchAlreadyEndedError extends RangeError {
  constructor(matchId: ObjectId) {
    super(`Match already ended: "${matchId.toString()}"`);
  }
}

export class TurnAlreadyStartedError extends Error {
  constructor(matchId: ObjectId, turn: number) {
    super(`Turn ${turn} already started for match "${matchId.toString()}"`);
  }
}

export class NotEnoughCardsError extends RangeError {
  constructor(cards: CardType[], expected: number) {
    super(`Expected ${cards.join()} to have minimum length ${expected}`);
  }
}

export class PlayerDoesNotHaveCards extends Error {
  constructor(
    matchId: ObjectId,
    userId: ObjectId,
    cards: CardType[],
    turn: number,
  ) {
    super(`Player "${
      userId.toString()
    }" does not have some of cards ${cards.join()} in match "${
      matchId.toString()
    }" at turn ${turn}`);
  }
}

export class CardsAreNotMeldError extends Error {
  constructor(cards: CardType[]) {
    super(`Cards ${cards.join()} are not valid meld`);
  }
}

export class TurnNotYetStartedError extends Error {
  constructor(matchId: ObjectId, turn: number) {
    super(`Turn ${turn} not yet started for match "${matchId.toString()}"`);
  }
}
