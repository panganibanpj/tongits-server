// @flow
import type { ObjectId } from 'mongoose';

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
  constructor(matchId: ObjectId, userId: ObjectId) {
    super(`Player "${
      userId.toString()
    }" not the active player in match "${
      matchId.toString()
    }"`);
  }
}

export class MatchAlreadyEndedError extends RangeError {
  constructor(matchId: ObjectId) {
    super(`Match already ended: "${matchId.toString()}"`);
  }
}
