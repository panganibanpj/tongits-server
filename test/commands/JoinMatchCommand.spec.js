// @flow
import { assert } from 'chai';
import {
  createDocuments,
  randomId,
  createdIds,
  executionError,
  resetDocuments,
  findMatchById,
  findSeriesById,
} from '../testHelpers';
import {
  NotEnoughPlayersError,
  UserNotFoundError,
  MatchNotFoundError,
  MatchAlreadyStartedError,
  PlayersNotInMatchError,
} from '../../src/utils/errors';
import JoinMatchCommand from '../../src/commands/JoinMatchCommand';

describe('commands/JoinMatchCommand', () => {
  before(() => createDocuments({
    user: ['basic0', 'empty', 'basic1'],
    series: ['notStarted0'],
    match: ['notStarted0', 'started0'],
  }));

  it('throws if not enough players', () => {
    const matchId = randomId();
    const userIds = [];
    assert.throws(
      () => new JoinMatchCommand(matchId, userIds),
      NotEnoughPlayersError,
    );
  });
  it('throws if a given User does not exist', async () => {
    const matchId = createdIds.match.notStarted0;
    const userId = randomId();
    const command = new JoinMatchCommand(matchId, [userId]);

    const error = await executionError(command);
    assert.instanceOf(error, UserNotFoundError);
  });
  it('throws if given Match does not exist', async () => {
    const matchId = randomId();
    const userId = createdIds.user.basic0;
    const command = new JoinMatchCommand(matchId, [userId]);

    const error = await executionError(command);
    assert.instanceOf(error, MatchNotFoundError);
  });
  it('throws if given Match has already started', async () => {
    const matchId = createdIds.match.started0;
    const userId = createdIds.user.basic0;
    const command = new JoinMatchCommand(matchId, [userId]);

    const error = await executionError(command);
    assert.instanceOf(error, MatchAlreadyStartedError);
  });
  it('throws if given Match does not include all given players', async () => {
    const matchId = createdIds.match.notStarted0;
    const userId = createdIds.user.empty;
    const command = new JoinMatchCommand(matchId, [userId]);

    const error = await executionError(command);
    assert.instanceOf(error, PlayersNotInMatchError);
  });
  it('joins given players for Match', async () => {
    await resetDocuments({ match: 'notStarted0' });
    const matchId = createdIds.match.notStarted0;
    const userId = createdIds.user.basic1;
    const command = new JoinMatchCommand(matchId, [userId]);
    await command.execute();

    const match = await findMatchById(matchId);
    assert(match.playerHasJoined(userId));
  });
  it('joins given players for Series if needed', async () => {
    await resetDocuments({
      series: 'notStarted0',
      match: 'notStarted0',
    });
    const matchId = createdIds.match.notStarted0;
    const userId = createdIds.user.basic1;
    const command = new JoinMatchCommand(matchId, [userId]);
    await command.execute();

    const seriesId = createdIds.series.notStarted0;
    const series = await findSeriesById(seriesId);
    assert(series.playerHasJoined(userId));
  });
});
