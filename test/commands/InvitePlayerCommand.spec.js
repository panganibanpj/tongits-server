// @flow
import { assert } from 'chai';
import Series from '../../src/models/SeriesModel';
import NotEnoughPlayersError from '../../src/utils/NotEnoughPlayersError';
import UserNotFoundError from '../../src/utils/UserNotFoundError';
import SeriesNotFoundError from '../../src/utils/SeriesNotFoundError';
import { createUser, createId } from '../testHelpers';
import InvitePlayerCommand, {
  SeriesAlreadyStartedError,
} from '../../src/commands/InvitePlayerCommand';

describe('commands/InvitePlayerCommand', () => {
  describe('constructor', () => {
    it('throws if not enough players', () => {
      const seriesId = createId();
      const userIds = [];
      assert.throws(
        () => new InvitePlayerCommand(seriesId, userIds),
        NotEnoughPlayersError,
      );
    });
  });

  describe('execute', () => {
    it('throws if a given User does not exist', async () => {
      const seriesId = createId();
      const userId = createId();
      const command = new InvitePlayerCommand(seriesId, [userId]);

      let foundError = null;
      try {
        await command.execute();
      } catch (error) {
        foundError = error;
      }
      assert.instanceOf(foundError, UserNotFoundError);
    });
    it('throws if given Series does not exist', async () => {
      const seriesId = createId();
      const userId = (await createUser()).getId();
      const command = new InvitePlayerCommand(seriesId, [userId]);

      let foundError = null;
      try {
        await command.execute();
      } catch (error) {
        foundError = error;
      }
      assert.instanceOf(foundError, SeriesNotFoundError);
    });
    it('throws if given Series has already started', async () => {
      const seriesId = (await Series.create({ startTime: new Date() })).getId();
      const userId = (await createUser()).getId();
      const command = new InvitePlayerCommand(seriesId, [userId]);

      let foundError = null;
      try {
        await command.execute();
      } catch (error) {
        foundError = error;
      }
      assert.instanceOf(foundError, SeriesAlreadyStartedError);
    });
    it('adds players to series', async () => {
      const seriesId = (await Series.create({})).getId();
      const userId = (await createUser()).getId();
      const command = new InvitePlayerCommand(seriesId, [userId]);
      await command.execute();

      const series = await Series.findById(seriesId);
      if (!series) return; // make flow happy
      assert.lengthOf(series.players, 1);
      assert.equal(series.players[0].userId.toString(), userId.toString());
    });
    it('does not duplicate or overwrite players in series', async () => {
      const userId = (await createUser()).getId();
      const players = [{ userId, pesos: 100 }];
      const seriesId = (await Series.create({ players })).getId();
      const command = new InvitePlayerCommand(seriesId, [userId]);
      await command.execute();

      const series = await Series.findById(seriesId);
      if (!series) return; // make flow happy
      assert.lengthOf(series.players, 1);
      const [player] = series.players;
      assert.equal(player.userId.toString(), userId.toString());
      assert.equal(player.pesos, 100);
    });
  });
});
