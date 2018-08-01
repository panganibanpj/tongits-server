// @flow
import mongoose, { Schema, type ObjectId } from 'mongoose';
import BaseModel from './BaseModel';
import SeriesSchema from './schemas/SeriesSchema';
import type { BetTypesType } from '../types/betTypes';

const schema = new Schema(SeriesSchema);

export type PlayerType = {|
  joinTime?: Date,
  pesos?: number,
  userId: ObjectId,
|};

class Series extends BaseModel {
  createTime: Date;
  startTime: ?Date;
  round: number;
  betType: BetTypesType;
  twoHits: ?ObjectId;
  jackpot: number;
  players: PlayerType[];

  static defaults() {
    return {
      round: 0,
      betType: 'BASIC',
      jackpot: 0,
      players: [],
    };
  }

  static playerDefaults() {
    return {
      pesos: 0,
    };
  }

  hasPlayer(userId: ObjectId): boolean {
    const { players } = this;
    const userIdString = userId.toString();
    return players.some(player => player.userId.toString() === userIdString);
  }

  static makeNewPlayer(userId: ObjectId): PlayerType {
    return {
      ...Series.playerDefaults(),
      userId,
    };
  }

  async addPlayers(userIds: ObjectId[]): Promise<this> {
    const newPlayers = userIds
      .filter(userId => !this.hasPlayer(userId))
      .map(Series.makeNewPlayer);

    if (!newPlayers.length) return Promise.resolve(this);

    this.players.push(...newPlayers);
    return this.save();
  }

  started() {
    return !!this.startTime;
  }
}

schema.loadClass(Series);
export const COLLECTION_NAME = 'series';
export default mongoose.model(COLLECTION_NAME, schema);
