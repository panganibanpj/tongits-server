// @flow
import { assert } from 'chai';
import Series from '../../src/models/SeriesModel';
import Match from '../../src/models/MatchModel';
import { createUserId, randomId, equalIds } from '../testHelpers';
import {
  NotEnoughPlayersError,
  UserNotFoundError,
} from '../../src/utils/errors';
import CreateSeriesCommand from '../../src/commands/CreateSeriesCommand';

describe('commands/CreateSeriesCommand', () => {
  describe('failure', () => {
    it('throws if no players', () => {
      assert.throws(() => new CreateSeriesCommand({
        betType: 'BASIC',
        players: [],
      }), NotEnoughPlayersError);
    });
    it('throws if a given player does not exist', async () => {
      const command = new CreateSeriesCommand({
        betType: 'BASIC',
        players: [{ userId: randomId() }],
      });
      try {
        await command.execute();
      } catch (error) {
        return assert.instanceOf(error, UserNotFoundError);
      }
      throw new Error('was supposed to fail!');
    });
  });

  describe('success', () => {
    let userId;
    before(async () => {
      userId = await createUserId();
      const series = await Series.findOne({ 'players.userId': userId });
      // sanity check
      assert.notExists(series);
    });

    it('creates and saves a Series', async () => {
      const command = new CreateSeriesCommand({
        betType: 'BASIC',
        players: [{ userId }],
      });
      await command.execute();

      // saves it
      const series = await Series.findOne({ 'players.userId': userId });
      assert.exists(series);
      if (!series) throw new Error(); // make flow happy
      assert.lengthOf(series.players, 1);
      assert(equalIds(series.players[0].userId, userId));
    });
    it('creates and saves a Match', async () => {
      const command = new CreateSeriesCommand({
        betType: 'BASIC',
        players: [{ userId }],
      });
      const series = await command.execute();

      const match = await Match.findOne({ seriesId: series.getId() });
      assert.exists(match);
      if (!match) throw new Error(); // make flow happy
      assert.lengthOf(match.players, 1);
      if (!match.players) throw new Error(); // make flow happy
      assert(equalIds(match.players[0].userId, userId));
    });
    it('does not create a Match if createMatch: false', async () => {
      const command = new CreateSeriesCommand({
        betType: 'BASIC',
        players: [{ userId }],
      }, false);
      const series = await command.execute();

      const match = await Match.findOne({ seriesId: series.getId() });
      assert.notExists(match);
    });
  });
});
