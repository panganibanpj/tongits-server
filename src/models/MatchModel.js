// @flow
import mongoose, { Schema, type ObjectId } from 'mongoose';
import BaseModel from './BaseModel';
import MatchSchema from './schemas/MatchSchema';
import { includesId, pluckUserIds, equalIds } from './modelHelpers';
import { dealCards, type DealtCardsType } from '../utils/cardHelpers';
import type Series from './SeriesModel';
import type { CardType } from '../types/deck';

const schema = new Schema(MatchSchema);

type PlayerType = {|
  bet?: ?boolean,
  blockedTurns?: number,
  discard?: CardType[],
  hand?: CardType[],
  joinTime?: Date,
  melds?: {|
    runs: CardType[][],
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
  jackpot: ?number;
  turn: ?number;
  pile: ?CardType[];
  turnStarted: ?boolean;
  turnEnded: ?boolean;
  players: PlayerType[];
  button: ?boolean;

  static defaults() {
    return {
      players: [],
    };
  }

  static invitedPlayerDefaults() {
    return {};
  }

  static joinedPlayerDefaults() {
    return {
      bet: null,
      blockedTurns: -1,
      discard: [],
      melds: {
        runs: [],
        sets: {},
      },
    };
  }

  hasPlayer(userId: ObjectId): boolean {
    return includesId(pluckUserIds(this.players), userId);
  }

  hasPlayers(userIds: ObjectId[]): boolean {
    if (!userIds.length) return false;
    return userIds.every(userId => this.hasPlayer(userId));
  }

  static makeNewPlayer(userId: ObjectId): PlayerType {
    return {
      ...Match.invitedPlayerDefaults(),
      userId,
    };
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

  get isFirstRound() {
    return this.round === 0;
  }

  get allPlayersJoined() {
    return this.players.every(({ joinTime }) => !!joinTime);
  }

  nextTurn() {
    if (this.turn === 0 || !!this.turn) {
      this.turn += 1;
    } else {
      this.turn = 0;
    }
    this.turnStarted = true;
    this.turnEnded = false;
  }

  prepareMatch(series: Series, pile: CardType[], startTime: ?Date) {
    this.startTime = startTime || new Date();
    this.jackpot = series.jackpot;
    this.pile = pile;
    this.nextTurn();
  }

  preparePlayers(series: Series, dealtCards: DealtCardsType) {
    this.players.forEach((player, i) => {
      const seriesPlayer = series.getPlayer(player.userId);
      if (!seriesPlayer) return; // make flow happy
      Object.assign(this.players[i], {
        ...Match.joinedPlayerDefaults(),
        hand: dealtCards[i],
        pesos: seriesPlayer.pesos,
      });
    });
  }

  async startMatch(series: Series, startTime: ?Date) {
    const dealtCards = dealCards(this.players.length);
    this.prepareMatch(series, dealtCards.pile, startTime);
    this.preparePlayers(series, dealtCards);
    await this.save();
    return this;
  }
}

schema.loadClass(Match);
export const COLLECTION_NAME = 'match';
export default mongoose.model(COLLECTION_NAME, schema);
