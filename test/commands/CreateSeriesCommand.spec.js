// @flow
import { assert } from 'chai';
import mongoose from 'mongoose';
import Series from '../../src/models/SeriesModel';
import CreateSeriesCommand from '../../src/commands/CreateSeriesCommand';

describe('commands/CreateSeriesCommand', () => {
  it('throws if not enough players', () => {
    assert.throws(() => new CreateSeriesCommand({
      betType: 'BASIC',
      players: [],
    }));
  });
  it('creates a series', async () => {
    const userId = new mongoose.Types.ObjectId();
    let series = await Series.findOne({ 'players.userId': userId });
    assert.notExists(series);

    const command = new CreateSeriesCommand({
      betType: 'BASIC',
      players: [{ userId }],
    });
    await command.execute();

    series = await Series.findOne({ 'players.userId': userId });
    assert.exists(series);
  });
});
