// @flow
import { Schema } from 'mongoose';

export const CreateTime = {
  $type: Date,
  default: Date.now,
};

export const NaturalNumber = {
  $type: Number,
  min: 0,
  validate: Number.isInteger,
};

export const Integer = {
  $type: Number,
  validate: Number.isInteger,
};

export const User = {
  $type: Schema.Types.ObjectId,
  ref: 'user',
};
