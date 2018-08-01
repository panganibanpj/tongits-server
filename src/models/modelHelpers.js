// @flow
import type { ObjectId } from 'mongoose';

type PlayerType = {
  userId: ObjectId,
};

export const hasPlayer = (
  players: PlayerType[],
  userId: ?ObjectId,
): boolean => {
  if (!userId) return false;
  const userIdString = userId.toString();
  const isGivenUser = playerId => playerId.toString() === userIdString;
  return players.some(({ userId: playerId }) => isGivenUser(playerId));
};

export const hasPlayers = (
  players: PlayerType[],
  userIds: ObjectId[] = [],
): boolean => {
  if (!userIds.length) return false;
  return userIds.every(userId => hasPlayer(players, userId));
};

export const addPlayer = (players: PlayerType[], userId: ObjectId) => {
  players.push({ userId });
};

export default (players: any[], userIds: ObjectId[] = []) => {
  userIds.forEach((userId) => {
    if (!hasPlayer(players, userId)) addPlayer(players, userId);
  });
};
