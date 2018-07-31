// @flow
import type { BSONObjectId } from 'mongoose';

type PlayersType = Array<{ userId: BSONObjectId }>;

export const hasPlayer = (players: PlayersType, userId: ?BSONObjectId): boolean => {
  if (!userId) return false;
  const userIdString = userId.toString();
  const isGivenUser = playerId => playerId.toString() === userIdString;
  return players.some(({ userId: playerId }) => isGivenUser(playerId));
};

export default (players: PlayersType, userIds: Array<BSONObjectId> = []): boolean => {
  if (!userIds.length) return false;
  return userIds.every(userId => hasPlayer(players, userId));
};
