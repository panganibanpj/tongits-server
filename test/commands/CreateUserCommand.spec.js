// @flow
import { assert } from 'chai';
import User from '../../src/models/UserModel';
import CreateUserCommand from '../../src/commands/CreateUserCommand';

describe('commands/CreateUserCommand', () => {
  it('creates a user w given username', async () => {
    let user = await User.findOne({ username: 'foo' }).exec();
    assert.notExists(user);

    const command = new CreateUserCommand({
      username: 'foo',
      isConnected: true,
    });
    await command.execute();

    user = await User.findOne({ username: 'foo' }).exec();
    assert.exists(user);
  });
  // @NOTE: to be used for administration or testing
  it('creates a user with many fields loaded');
});
