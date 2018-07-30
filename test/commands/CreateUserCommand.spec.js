// @flow
import { assert } from 'chai';
import User from '../../src/models/UserModel';
import CreateUserCommand from '../../src/commands/CreateUserCommand';

describe('commands/CreateUserCommand', () => {
  it('creates a user on execute', async () => {
    let foo = await User.findOne({ username: 'foo' }).exec();
    assert.notExists(foo);

    const command = new CreateUserCommand({
      username: 'foo',
      isConnected: true,
    });
    await command.execute();

    foo = await User.findOne({ username: 'foo' }).exec();
    assert.exists(foo);
  });
});
