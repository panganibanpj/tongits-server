// @flow
import type { ObjectId } from 'mongoose';
import { hasPlayer } from './hasPlayers';

type PlayerType = {
  userId: ObjectId,
};

export const addPlayer = (players: PlayerType[], userId: ObjectId) => {
  players.push({ userId });
};

export default (players: PlayerType[], userIds: ObjectId[] = []) => {
  userIds.forEach(userId => !hasPlayer(players, userId) && addPlayer(players, userId));
};
