// @flow
import { assert } from 'chai';
import mongoose from 'mongoose';
import Match from '../../src/models/MatchModel';
import CreateMatchCommand from '../../src/commands/CreateMatchCommand';

describe('commands/CreateMatchCommand', () => {
  it('throws if not enough players', () => {
    const seriesId = new mongoose.Types.ObjectId();
    assert.throws(() => new CreateMatchCommand({
      seriesId,
      players: [],
    }));
  });
  it('creates a match', async () => {
    const seriesId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();
    let match = await Match.findOne({ 'players.userId': userId });
    assert.notExists(match);

    const command = new CreateMatchCommand({
      seriesId,
      players: [{ userId }],
    });
    await command.execute();

    match = await Match.findOne({ 'players.userId': userId });
    assert.exists(match);
  });
  // @NOTE: to be used for administration or testing
  it('creates a match with 3 existing players');
});
