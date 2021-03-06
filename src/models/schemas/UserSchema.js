// @flow
import { CreateTime, User as UserRef } from './schemaHelpers';

export default {
  username: {
    $type: String,
    unique: true,
    required: true,
  },
  email: String, // @TODO: email validation
  picture: String, // @TODO: url validation. gravatar? FB? G+?
  createTime: CreateTime,
  isConnected: {
    $type: Boolean,
    // required: true,
  },
  friends: [UserRef],
  facebookId: {
    $type: String,
    unique: true,
    sparse: true,
  },
  googleId: {
    $type: String,
    unique: true,
    sparse: true,
  },
};
