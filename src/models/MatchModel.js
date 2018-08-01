// @flow
import mongoose, { Schema, type ObjectId } from 'mongoose';
import BaseModel from './BaseModel';
import MatchSchema from './schemas/MatchSchema';
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

class MatchClass extends BaseModel {
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
  players: ?PlayerType[];
  button: ?boolean;
}

schema.loadClass(MatchClass);
export const COLLECTION_NAME = 'match';
export default mongoose.model(COLLECTION_NAME, schema);
