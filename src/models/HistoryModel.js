// @flow
import mongoose, { Schema } from 'mongoose';
import { CreateTime, NaturalNumber, User } from '../util/model-helpers';

export default mongoose.model('history', new Schema({
  createTime: CreateTime,
  matchId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
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
  action: {
    type: String,
    enum: [],
    required: true,
  },
  undo: {
    type: Boolean,
    default: false,
  },
}));
