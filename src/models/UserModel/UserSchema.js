// @flow
import { CreateTime, User as UserRef } from '../../utils/modelHelpers';

export default {
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: String, // @TODO: email validation
  picture: String, // @TODO: url validation. gravatar? FB? G+?
  joinDate: CreateTime,
  isConnected: {
    type: Boolean,
    required: true,
  },
  friends: {
    type: [UserRef],
    default: [],
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true,
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
};
