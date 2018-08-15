// @flow
import mongoose, { Schema, type ObjectId } from 'mongoose';
import BaseModel from './BaseModel';
import SeriesSchema from './schemas/SeriesSchema';
import { includesId, pluckUserIds, equalIds } from './modelHelpers';
import BET_TYPES from '../constants/BET_TYPES.json';
import type { BetType, BetTypesType } from '../types/betTypes';

const schema = new Schema(SeriesSchema, { typeKey: '$type' });

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
    return includesId(pluckUserIds(this.players), userId);
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

  get hasStarted() {
    return !!this.startTime;
  }

  async joinPlayers(userIds: ObjectId[], joinTime?: Date) {
    const sharedJoinTime = joinTime || new Date();
    this.players.forEach((player, i) => {
      if (includesId(userIds, player.userId)) {
        this.players[i].joinTime = sharedJoinTime;
      }
    });
    await this.save();
  }

  getPlayer(userId: ObjectId): ?PlayerType {
    return this.players.find(player => equalIds(player.userId, userId));
  }

  playerHasJoined(userId: ObjectId) {
    const player = this.getPlayer(userId);
    return player && !!player.joinTime;
  }

  setStartTime(startTime: ?Date) {
    this.startTime = startTime || new Date();
  }

  get hasTwoHits() {
    return !!this.twoHits;
  }

  anteUp() {
    const betConfig = (BET_TYPES[this.betType]: BetType);
    const ante = this.hasTwoHits ? betConfig.ANTE : betConfig.FIRST_ANTE;
    this.jackpot += this.players.length * ante;
    this.players.forEach((player, i) => {
      this.players[i].pesos = player.pesos ? player.pesos - ante : -ante;
    });
  }

  async startMatch(startTime: ?Date) {
    this.anteUp();
    if (!this.hasStarted) this.setStartTime(startTime);
    await this.save();
    return this;
  }
}

schema.loadClass(Series);
export const COLLECTION_NAME = 'series';
export default mongoose.model(COLLECTION_NAME, schema);
