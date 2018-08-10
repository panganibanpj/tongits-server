// @flow
import { assert } from 'chai';
import {
  NotEnoughPlayersError,
  UserNotFoundError,
  SeriesNotFoundError,
} from '../../src/utils/errors';
import {
  createDocuments,
  randomId,
  createdIds,
  executionError,
  resetSeries,
  findSeriesById,
  equalIds,
} from '../testHelpers';
import InvitePlayerCommand, {
  SeriesAlreadyStartedError,
} from '../../src/commands/InvitePlayerCommand';

describe('commands/InvitePlayerCommand', () => {
  before(() => createDocuments({
    user: ['basic0', 'empty'],
    series: ['notStarted0', 'started0', 'empty'],
  }));

  it('throws if not enough players', () => {
    const seriesId = createdIds.series.notStarted0;
    const userIds = [];
    assert.throws(
      () => new InvitePlayerCommand(seriesId, userIds),
      NotEnoughPlayersError,
    );
  });
  it('throws if a given User does not exist', async () => {
    const seriesId = createdIds.series.notStarted0;
    const userId = randomId();
    const command = new InvitePlayerCommand(seriesId, [userId]);

    const error = await executionError(command);
    assert.instanceOf(error, UserNotFoundError);
  });
  it('throws if given Series does not exist', async () => {
    const seriesId = randomId();
    const userId = createdIds.user.basic0;
    const command = new InvitePlayerCommand(seriesId, [userId]);

    const error = await executionError(command);
    assert.instanceOf(error, SeriesNotFoundError);
  });
  it('throws if given Series has already started', async () => {
    const seriesId = createdIds.series.started0;
    const userId = createdIds.user.basic0;
    const command = new InvitePlayerCommand(seriesId, [userId]);

    const error = await executionError(command);
    assert.instanceOf(error, SeriesAlreadyStartedError);
  });
  it('adds players to series', async () => {
    const seriesId = createdIds.series.empty;
    const userId = createdIds.user.empty;
    await resetSeries('empty');
    const command = new InvitePlayerCommand(seriesId, [userId]);
    await command.execute();

    const series = await findSeriesById(seriesId);
    assert.lengthOf(series.players, 1);
    assert(equalIds(series.players[0].userId, userId));
  });
  it('does not duplicate or overwrite players in series', async () => {
    const userId = createdIds.user.basic0;
    const seriesId = createdIds.series.notStarted0;
    await resetSeries('notStarted0');
    let series = await findSeriesById(seriesId);
    const { joinTime: timeBeforeExec } = series.players[0];
    const command = new InvitePlayerCommand(seriesId, [userId]);
    await command.execute();

    series = await findSeriesById(seriesId);
    assert.lengthOf(series.players, 3);
    const [player] = series.players;
    assert(equalIds(player.userId, userId));
    if (!player.joinTime || !timeBeforeExec) throw new Error(); // make flow happy
    assert.equal(player.joinTime.getTime(), timeBeforeExec.getTime());
  });
});
