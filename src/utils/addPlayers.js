// @flow
import type { BSONObjectId } from 'mongoose';

type PlayersType = Array<{ userId: BSONObjectId }>;

export const addPlayer = (players: PlayersType, userId: BSONObjectId) => {
  players.push({ userId });
};

export default (players: PlayersType, userIds: Array<BSONObjectId> = []) => {
  userIds.forEach(userId => addPlayer(players, userId));
};
