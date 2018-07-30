// @flow
import mongoose, { Schema, type BSONObjectId } from 'mongoose';
import BaseModel from '../BaseModel';
import SeriesSchema from './SeriesSchema';
import type { BetTypesType } from '../../types/betTypes';
import type { InvitedPlayerType, JoinedPlayerType } from './SeriesType';

const schema = new Schema(SeriesSchema);

class SeriesClass extends BaseModel {
  createTime: Date;
  round: number;
  betType: BetTypesType;
  twoHits: ?BSONObjectId;
  jackpot: number;
  players: Array<InvitedPlayerType | JoinedPlayerType>;

  hasPlayer(userId: ?BSONObjectId): boolean {
    if (!userId) return false;
    const userIdString = userId.toString();
    const isGivenUser = playerId => playerId.toString() === userIdString;
    return this.players.some(({ userId: playerId }) => isGivenUser(playerId));
  }

  hasPlayers(userIds: Array<BSONObjectId> = []): boolean {
    if (!userIds.length) return false;
    return userIds.every(userId => this.hasPlayer(userId));
  }
}

schema.loadClass(SeriesClass);
export const COLLECTION_NAME = 'series';
export default mongoose.model(COLLECTION_NAME, schema);
export * from './SeriesType';
