// @flow
import mongoose, { Schema, type ObjectId } from 'mongoose';
import { CreateTime, NaturalNumber, User } from './schemas/schemaHelpers';
import COMMANDS, { type CommandsType } from '../commands';
import { COLLECTION_NAME as Match } from './MatchModel';

export type HistoryType = {|
  command: CommandsType,
  createTime?: Date,
  matchId: ObjectId,
  turn: number,
  undo?: boolean,
  userId: ObjectId,
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

class History /* :: extends Mongoose$Document */ {
  createTime: Date;
  matchId: ObjectId;
  turn: number;
  userId: ObjectId;
  command: CommandsType;
  undo: boolean;
}

schema.loadClass(History);
export default mongoose.model('history', schema);
