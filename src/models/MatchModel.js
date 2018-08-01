// @flow
import mongoose, { Schema, type ObjectId } from 'mongoose';
import BaseModel from './BaseModel';
import MatchSchema from './schemas/MatchSchema';
import { includesId } from './modelHelpers';
import type { CardType } from '../types/deck';

const schema = new Schema(MatchSchema);

type PlayerType = {|
  bet?: ?boolean,
  blockedTurns?: number,
  discard?: CardType[],
  hand?: CardType[],
  joinTime?: Date,
  melds?: {|
    runs: CardType[],
    sets: { [string]: CardType[] },
  |},
  pesos?: number,
  userId: ObjectId,
|};

class Match extends BaseModel {
  seriesId: ObjectId;
  round: ?number;
  better: ?ObjectId;
  createTime: Date;
  startTime: ?Date;
  endTime: ?Date;
  winner: ?ObjectId;
  jackpot: number;
  turn: number;
  pile: ?CardType[];
  turnStarted: ?boolean;
  turnEnded: ?boolean;
  players: PlayerType[];
  button: ?boolean;

  static defaults() {
    return {
      turn: 0,
      jackpot: 0,
      players: [],
    };
  }

  static playerDefaults() {
    return {
      bet: null,
      pesos: 0,
    };
  }

  hasPlayer(userId: ObjectId): boolean {
    const { players } = this;
    const userIdString = userId.toString();
    return players.some(player => player.userId.toString() === userIdString);
  }

  hasPlayers(userIds: ObjectId[]): boolean {
    if (!userIds.length) return false;
    return userIds.every(userId => this.hasPlayer(userId));
  }

  static makeNewPlayer(userId: ObjectId): PlayerType {
    return {
      ...Match.playerDefaults(),
      userId,
    };
  }

  started() {
    return !!this.startTime;
  }

  async playersJoined(userIds: ObjectId[], joinTime?: Date) {
    const sharedJoinTime = joinTime || new Date();
    this.players.forEach((player, i) => {
      if (includesId(userIds, player.userId)) {
        this.players[i].joinTime = sharedJoinTime;
      }
    });
    await this.save();
  }
}

schema.loadClass(Match);
export const COLLECTION_NAME = 'match';
export default mongoose.model(COLLECTION_NAME, schema);
