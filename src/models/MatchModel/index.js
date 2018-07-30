// @flow
import mongoose, { Schema, type BSONObjectId } from 'mongoose';
import BaseModel from '../BaseModel';
import MatchSchema from './MatchSchema';
import type { CardType } from '../../types/deck';
import type { InvitedPlayerType, JoinedPlayerType } from './MatchType';

const schema = new Schema(MatchSchema);

class MatchClass extends BaseModel {
  seriesId: BSONObjectId;
  round: number;
  better: ?BSONObjectId;
  createTime: Date;
  startTime: ?Date;
  endTime: ?Date;
  winner: ?BSONObjectId;
  jackpot: ?number;
  turn: ?number;
  pile: Array<CardType>;
  turnStarted: boolean;
  turnEnded: boolean;
  players: Array<InvitedPlayerType | JoinedPlayerType>;
  button: boolean;
}

schema.loadClass(MatchClass);
export const COLLECTION_NAME = 'match';
export default mongoose.model(COLLECTION_NAME, schema);
export * from './MatchType';
