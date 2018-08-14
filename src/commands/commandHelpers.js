// @flow
import flow from 'lodash/flow';
import identity from 'lodash/identity';
import type { ObjectId } from 'mongoose';
import Match from '../models/MatchModel';
import {
  MatchNotFoundError,
  MatchNotStartedError,
  MatchAlreadyEndedError,
  PlayerNotActiveError,
  PlayerDoesNotHaveCards,
  TurnNotYetStartedError,
  TurnAlreadyStartedError,
} from '../utils/errors';
import type { CardType } from '../types/deck';

const matchExists = (matchId: ObjectId) => (match: ?Match): Match => {
  if (!match) throw new MatchNotFoundError(matchId);
  return match;
};

const hasStarted = (match: Match) => {
  if (!match.hasStarted) throw new MatchNotStartedError(match.getId());
  return match;
};

const hasNotEnded = (match: Match) => {
  if (match.hasEnded) throw new MatchAlreadyEndedError(match.getId());
  return match;
};

const hasActivePlayer = (userId: ObjectId) => (match: Match) => {
  if (!match.isActivePlayer(userId)) {
    throw new PlayerNotActiveError(match.getId(), userId, match.turn || 0);
  }
  return match;
};

const activePlayerHasCards = (
  cards: CardType[],
  userId: ObjectId,
) => (match: Match) => {
  if (!match.playerHasCards(userId, cards)) {
    throw new PlayerDoesNotHaveCards(
      match.getId(),
      userId,
      cards,
      match.turn || 0,
    );
  }
  return match;
};

const turnStatus = (turnStarted: boolean) => (match: Match) => {
  if (match.turnStarted !== turnStarted) {
    const ErrorToThrow = turnStarted
      ? TurnNotYetStartedError
      : TurnAlreadyStartedError;
    throw new ErrorToThrow(match.getId(), match.turn || 0);
  }

  return match;
};

// @NOTE(pj): calls validator iff args exists
//  e.g. `validateIfExists(hasActivePlayer, activePlayerId)` means
//  call `hasActivePlayer(activePlayerId)(match)` if `activePlayerId`
//  this makes validations optional
const validateIfExists = (
  func: (...partials: any) => (match: Match) => Match,
  ...args: (?any)[]
) => (
  args.some(arg => typeof arg === 'undefined') ? identity : func(...args)
);

type ValidateMatchArgsType = {|
  activePlayerUserId?: ObjectId,
  cardsInActiveHand?: CardType[],
  turnStarted?: boolean,
|};
export default async (
  matchId: ObjectId,
  validations?: ValidateMatchArgsType,
): Promise<Match> => {
  const {
    activePlayerUserId,
    cardsInActiveHand,
    turnStarted,
  } = validations || {};
  const validate: (match: ?Match) => Match = flow([
    matchExists(matchId),
    hasStarted,
    hasNotEnded,
    validateIfExists(hasActivePlayer, activePlayerUserId),
    validateIfExists(
      activePlayerHasCards,
      cardsInActiveHand,
      activePlayerUserId,
    ),
    validateIfExists(turnStatus, turnStarted),
  ]);
  const match = await Match.findById(matchId);
  return validate(match);
};
