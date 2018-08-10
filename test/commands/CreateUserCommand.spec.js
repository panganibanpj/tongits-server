// @flow
import { assert } from 'chai';
import User from '../../src/models/UserModel';
import CreateUserCommand from '../../src/commands/CreateUserCommand';

describe('commands/CreateUserCommand', () => {
  it('creates a user w given username', async () => {
    const username = 'commands.CreateUserCommand.test1';
    let user = await User.findOne({ username });
    assert.notExists(user);

    const command = new CreateUserCommand({
      username,
      isConnected: true,
    });
    await command.execute();

    user = await User.findOne({ username });
    assert.exists(user);
  });
});
