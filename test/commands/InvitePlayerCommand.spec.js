// @flow
import { assert } from 'chai';
import Series from '../../src/models/SeriesModel';
import NotEnoughPlayersError from '../../src/utils/NotEnoughPlayersError';
import UserNotFoundError from '../../src/utils/UserNotFoundError';
import SeriesNotFoundError from '../../src/utils/SeriesNotFoundError';
import {
  randomId,
  createUserId,
  createSeriesId,
  equalIds,
} from '../testHelpers';
import InvitePlayerCommand, {
  SeriesAlreadyStartedError,
} from '../../src/commands/InvitePlayerCommand';

describe('commands/InvitePlayerCommand', () => {
  it('throws if not enough players', () => {
    const seriesId = randomId();
    const userIds = [];
    assert.throws(
      () => new InvitePlayerCommand(seriesId, userIds),
      NotEnoughPlayersError,
    );
  });
  it('throws if a given User does not exist', async () => {
    const seriesId = randomId();
    const userId = randomId();
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
    const seriesId = randomId();
    const userId = await createUserId();
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
    const seriesId = await createSeriesId({ startTime: new Date() });
    const userId = await createUserId();
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
    const seriesId = await createSeriesId();
    const userId = await createUserId();
    const command = new InvitePlayerCommand(seriesId, [userId]);
    await command.execute();

    const series = await Series.findById(seriesId);
    if (!series) return; // make flow happy
    assert.lengthOf(series.players, 1);
    assert(equalIds(series.players[0].userId, userId));
  });
  it('does not duplicate or overwrite players in series', async () => {
    const userId = await createUserId();
    const players = [{ userId, pesos: 100 }];
    const seriesId = await createSeriesId({ players });
    const command = new InvitePlayerCommand(seriesId, [userId]);
    await command.execute();

    const series = await Series.findById(seriesId);
    if (!series) return; // make flow happy
    assert.lengthOf(series.players, 1);
    const [player] = series.players;
    assert(equalIds(player.userId, userId));
    assert.equal(player.pesos, 100);
  });
});
