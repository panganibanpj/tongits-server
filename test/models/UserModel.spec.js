// @flow
import { assert } from 'chai';
import { Types } from 'mongoose';
import User from '../../src/models/UserModel';

describe('models/UserModel', () => {
  describe('static allExist', () => {
    const createUserIds = async (num) => {
      const creates = [];
      for (let i = 0; i < num; i++) { // eslint-disable-line no-plusplus
        creates.push(User.create({
          username: (new Types.ObjectId()).toString(),
          isConnected: true,
        }));
      }
      const users = await Promise.all(creates);
      return users.map(user => user.getId());
    };

    it('returns true if all userIds exist', async () => {
      const userIds = await createUserIds(3);
      const allExist = await User.allExist(userIds);
      assert(allExist);
    });

    it('returns false if some do not exist', async () => {
      const userIds = await createUserIds(3);
      userIds.push(new Types.ObjectId());
      let allExist = await User.allExist(userIds);
      assert(!allExist);

      userIds.pop();
      userIds.push(null);
      allExist = await User.allExist(userIds);
      assert(!allExist);
    });

    it('returns false no input', async () => {
      let allExist = await User.allExist();
      assert(!allExist);
      allExist = await User.allExist([]);
      assert(!allExist);
    });
  });
});
