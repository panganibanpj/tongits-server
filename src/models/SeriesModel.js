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

class SeriesClass extends BaseModel {
  createTime: Date;
  startTime: Date;
  round: number;
  betType: BetTypesType;
  twoHits: ?ObjectId;
  jackpot: number;
  players: PlayerType[];
}

schema.loadClass(SeriesClass);
export const COLLECTION_NAME = 'series';
export default mongoose.model(COLLECTION_NAME, schema);
