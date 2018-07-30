// @flow
import { assert } from 'chai';
import { Types } from 'mongoose';
import Series from '../../src/models/SeriesModel';
import Match from '../../src/models/MatchModel';
import NotEnoughPlayersError from '../../src/utils/NotEnoughPlayersError';
import SeriesNotFoundError from '../../src/utils/SeriesNotFoundError';
import CreateMatchCommand, {
  PlayersNotInSeriesError,
} from '../../src/commands/CreateMatchCommand';

describe('commands/CreateMatchCommand', () => {
  describe('constructor', () => {
    it('throws if not enough players', () => {
      assert.throws(() => new CreateMatchCommand({
        seriesId: new Types.ObjectId(),
        players: [],
      }), NotEnoughPlayersError);
    });
  });

  describe('execution', () => {
    it('throws if given series does not exist', async () => {
      const command = new CreateMatchCommand({
        seriesId: new Types.ObjectId(),
        players: [{ userId: new Types.ObjectId() }],
      });
      try {
        await command.execute();
      } catch (error) {
        return assert.instanceOf(error, SeriesNotFoundError);
      }
      throw new Error('was supposed to fail!');
    });
    it('throws if given players not in given series', async () => {
      const series = await Series.create({
        betType: 'BASIC',
        players: [{ userId: new Types.ObjectId() }],
      });
      const command = new CreateMatchCommand({
        seriesId: series.getId(),
        players: [{ userId: new Types.ObjectId() }],
      });
      try {
        await command.execute();
      } catch (error) {
        return assert.instanceOf(error, PlayersNotInSeriesError);
      }
      throw new Error('was supposed to fail!');
    });
    it('creates a match', async () => {
      const userId = new Types.ObjectId();
      const series = await Series.create({
        betType: 'BASIC',
        players: [{ userId }],
      });
      const seriesId = series.getId();

      let match = await Match.findOne({ seriesId });
      assert.notExists(match);

      const command = new CreateMatchCommand({
        seriesId,
        players: [{ userId }],
      });
      await command.execute();

      match = await Match.findOne({ seriesId });
      assert.exists(match);
    });
    // @NOTE: to be used for administration or testing
    it('creates a match with 3 existing players');
  });
});
