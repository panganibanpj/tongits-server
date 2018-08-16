// @flow
import mongoose, { Schema, type ObjectId } from 'mongoose';
import BaseModel from './BaseModel';
import MatchSchema from './schemas/MatchSchema';
import { includesId, pluckUserIds, equalIds } from './modelHelpers';
import { dealCards, getRank, type DealtCardsType } from '../utils/cardHelpers';
import { SET_MELD, type MeldType } from '../constants/MELD_TYPES';
import type Series from './SeriesModel';
import type { CardType, RankType } from '../types/deck';

const schema = new Schema(MatchSchema, { typeKey: '$type' });

type PlayerMeldType = {|
  cards: CardType[],
  setRank?: RankType,
  type: MeldType,
|};
type PlayerType = {|
  bet?: ?boolean,
  blocked?: boolean,
  discard?: CardType[],
  hand?: CardType[],
  joinTime?: Date,
  melds?: PlayerMeldType[],
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
  shouldEnd: ?boolean;
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
      blocked: false,
      discard: [],
      melds: [],
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

  nextTurn(turnStarted: ?boolean = false) {
    if (typeof this.turn === 'number' && this.turn >= 0) {
      this.turn += 1;
    } else {
      this.turn = 0;
    }

    this.turnStarted = turnStarted;
  }

  prepareMatch(series: Series, pile: CardType[], startTime: ?Date) {
    this.startTime = startTime || new Date();
    this.jackpot = series.jackpot;
    this.pile = pile;
    // @NOTE(pj): turn automatically started on turn 0 because player drew
    this.nextTurn(true);
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

  playerForTurn(turn: number) {
    const playerIndex = turn % this.players.length;
    return this.players[playerIndex];
  }

  activePlayer() {
    const { turn } = this;
    if (!turn && turn !== 0) throw new Error(); // make flow happy
    return this.playerForTurn(turn);
  }

  get hasEnded() {
    return !!this.endTime;
  }

  isActivePlayer(userId: ObjectId) {
    const activePlayer = this.activePlayer();
    return equalIds(activePlayer.userId, userId);
  }

  async drawCard() {
    const player = this.activePlayer();

    if (!this.pile) throw new Error(); // make flow happy
    const card: CardType = this.pile.shift();

    if (!player.hand) throw new Error(); // make flow happy
    player.hand.push(card);

    this.turnStarted = true;
    if (player.blocked) player.blocked = false;
    await this.save();
  }

  async endMatch(endTime: ?Date) {
    this.endTime = endTime || new Date();
    await this.save();
    return this;
  }

  playerHasCards(userId: ObjectId, cards: CardType[]) {
    const player = this.getPlayer(userId);
    if (!player || !player.hand) throw new Error(); // make flow happy
    const { hand } = player;
    return cards.every((card: CardType) => hand.includes(card));
  }

  get lastDiscard(): ?CardType {
    if (!this.turn) return null;
    const { discard } = this.previousPlayer();
    if (!discard) throw new Error(); // make flow happy
    return discard[discard.length - 1];
  }

  previousPlayer() {
    const { turn } = this;
    if (!turn) throw new Error(); // make flow happy
    return this.playerForTurn(turn - 1);
  }

  pickUpDiscard(): CardType {
    const previousPlayer = this.previousPlayer();
    if (!previousPlayer.discard) throw new Error(); // make flow happy
    return previousPlayer.discard.shift();
  }

  removeCardsFromHand(userId: ObjectId, cardsToRemove: CardType[]) {
    const player = this.getPlayer(userId);
    if (!player || !player.hand) throw new Error(); // make flow happy
    player.hand = player.hand.filter((card: CardType) => {
      const shouldRemoveCard = cardsToRemove.includes(card);
      return !shouldRemoveCard;
    });
    if (!player.hand.length) this.shouldEnd = true;
  }

  addToMelds(userId: ObjectId, meld: CardType[], meldType: MeldType) {
    const player = this.getPlayer(userId);
    if (!player) throw new Error(); // make flow happy;
    player.melds = player.melds || []; // make flow happy;
    player.melds.push({
      type: meldType,
      cards: meld,
      ...(meldType === SET_MELD ? { setRank: getRank(meld[0]) } : {}),
    });
  }

  async layDownMeld(meld: CardType[], meldType: MeldType) {
    const player = this.activePlayer();

    if (!player.hand) throw new Error(); // make flow happy
    this.removeCardsFromHand(player.userId, meld);

    this.addToMelds(player.userId, meld, meldType);

    await this.save();
  }

  async acceptDiscard(partialMeld: CardType[], meldType: MeldType) {
    const player = this.activePlayer();
    const discard: CardType = this.pickUpDiscard();

    if (!player.hand) throw new Error(); // make flow happy
    this.removeCardsFromHand(player.userId, partialMeld);

    const meld = partialMeld.concat(discard);
    this.addToMelds(player.userId, meld, meldType);

    this.turnStarted = true;
    if (player.blocked) player.blocked = false;
    await this.save();
  }

  async discard(card: CardType) {
    const player = this.activePlayer();
    this.removeCardsFromHand(player.userId, [card]);
    if (!player.discard) throw new Error(); // make flow happy
    player.discard.push(card);

    this.nextTurn();
    await this.save();
  }

  async bet() {
    const player = this.activePlayer();
    player.bet = true;
    this.better = player.userId;
    await this.save();
  }

  playerHasMelds(userId: ObjectId) {
    const player = this.getPlayer(userId);
    return player ? !!(player.melds || []).length : false; // make flow happy
  }

  playerIsBlocked(userId: ObjectId) {
    const player = this.getPlayer(userId) || {};
    return !!player.blocked;
  }
}

schema.loadClass(Match);
export const COLLECTION_NAME = 'match';
export default mongoose.model(COLLECTION_NAME, schema);
