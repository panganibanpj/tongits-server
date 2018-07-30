// @flow
import mongoose, { Schema, type MongoId } from 'mongoose';
import BaseModel from '../BaseModel';
import SeriesSchema from './SeriesSchema';
import type { BetTypesType } from '../../types/betTypes';
import type { InvitedPlayerType, JoinedPlayerType } from './SeriesType';

const schema = new Schema(SeriesSchema);

class SeriesClass extends BaseModel {
  createTime: Date;
  round: number;
  betType: BetTypesType;
  twoHits: ?MongoId;
  jackpot: number;
  players: Array<InvitedPlayerType | JoinedPlayerType>;

  hasPlayer(userId: ?MongoId): boolean {
    return this.players.some(({ userId: playerId }) => playerId === userId);
  }

  hasPlayers(userIds: Array<?MongoId> = []): boolean {
    if (!userIds.length) return false;
    return userIds.every(userId => this.hasPlayer(userId));
  }
}

schema.loadClass(SeriesClass);
export const COLLECTION_NAME = 'series';
export default mongoose.model(COLLECTION_NAME, schema);
export * from './SeriesType';
