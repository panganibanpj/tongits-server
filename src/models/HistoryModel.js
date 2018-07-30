// @flow
import mongoose, { Schema, type BSONObjectId } from 'mongoose';
import { CreateTime, NaturalNumber, User } from '../util/model-helpers';
import COMMANDS, { type CommandsType } from '../commands';
import { COLLECTION_NAME as Match } from './MatchModel';

export type HistoryType = {|
  command: CommandsType,
  createTime?: Date,
  matchId: bson$ObjectId,
  turn: number,
  undo?: boolean,
  userId: BSONObjectId,
|};

const schema = new Schema({
  createTime: CreateTime,
  matchId: {
    type: Schema.Types.ObjectId,
    ref: Match,
    required: true,
  },
  turn: {
    ...NaturalNumber,
    default: undefined,
    required: true,
  },
  userId: {
    ...User,
    default: undefined,
    required: true,
  },
  command: {
    type: String,
    enum: COMMANDS,
    required: true,
  },
  undo: {
    type: Boolean,
    default: false,
  },
});

schema.loadClass(class History /* :: extends Mongoose$Document */ {
  createTime: Date;
  matchId: bson$ObjectId;
  turn: number;
  userId: BSONObjectId;
  command: CommandsType;
  undo: boolean;
});

export default mongoose.model('history', schema);
