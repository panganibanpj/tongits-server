// @flow
import flow from 'lodash/flow';
import type { ObjectId } from 'mongoose';
import {
  MatchNotFoundError,
  MatchNotStartedError,
  MatchAlreadyEndedError,
  PlayerNotActiveError,
  PlayerDoesNotHaveCards,
} from '../utils/errors';
import type Match from '../models/MatchModel';
import type { CardType } from '../types/deck';

export const matchExists = (match: ?Match, matchId: ObjectId): Match => {
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

const matchAvailableForMoves: (
  match: ?Match,
  matchId: ObjectId,
) => Match = flow([
  matchExists,
  hasStarted,
  hasNotEnded,
]);

type PlayerHasCardsInMatchArgsType = {|
  cards: CardType[],
  match: ?Match,
  matchId: ObjectId,
  userId: ObjectId,
|};
export const playerHasCardsInMatch = ({
  userId,
  cards,
  match,
  matchId,
}: PlayerHasCardsInMatchArgsType): Match => {
  const safeMatch = matchAvailableForMoves(match, matchId);
  if (!safeMatch.isActivePlayer(userId)) {
    throw new PlayerNotActiveError(matchId, userId, safeMatch.turn || 0);
  }
  if (!safeMatch.playerHasCards(userId, cards)) {
    throw new PlayerDoesNotHaveCards(
      safeMatch.getId(),
      userId,
      cards,
      safeMatch.turn || 0,
    );
  }
  return safeMatch;
};
