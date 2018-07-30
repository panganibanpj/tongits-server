// @flow
import { assert } from 'chai';
import { Types } from 'mongoose';
import Series from '../../src/models/SeriesModel';
import User from '../../src/models/UserModel';
import NotEnoughPlayersError from '../../src/utils/NotEnoughPlayersError';
import UserNotFoundError from '../../src/utils/UserNotFoundError';
import CreateSeriesCommand from '../../src/commands/CreateSeriesCommand';

describe('commands/CreateSeriesCommand', () => {
  it('throws if not enough players', () => {
    assert.throws(() => new CreateSeriesCommand({
      betType: 'BASIC',
      players: [],
    }), NotEnoughPlayersError);
  });
  it('throws if a given player does not exist', async () => {
    const command = new CreateSeriesCommand({
      betType: 'BASIC',
      players: [{ userId: new Types.ObjectId() }],
    });
    try {
      await command.execute();
    } catch (error) {
      return assert.instanceOf(error, UserNotFoundError);
    }
    throw new Error('was supposed to fail!');
  });
  it('creates a series', async () => {
    const user = await User.create({
      username: 'commands.CreateSeriesCommand.test1',
      isConnected: true,
    });
    const userId = user.getId();
    let series = await Series.findOne({ 'players.userId': userId });
    // sanity check
    assert.notExists(series);

    const command = new CreateSeriesCommand({
      betType: 'BASIC',
      players: [{ userId }],
    });
    await command.execute();

    series = await Series.findOne({ 'players.userId': userId });
    assert.exists(series);
  });
  // @NOTE: to be used for administration or testing
  it('creates a series with 3 existing players');
});
