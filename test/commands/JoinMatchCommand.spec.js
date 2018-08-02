// @flow
import { assert } from 'chai';
import Match from '../../src/models/MatchModel';
import Series from '../../src/models/SeriesModel';
import {
  randomId,
  createUserId,
  createMatchId,
  createSeriesId,
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
  it('throws if not enough players', () => {
    const matchId = randomId();
    const userIds = [];
    assert.throws(
      () => new JoinMatchCommand(matchId, userIds),
      NotEnoughPlayersError,
    );
  });
  it('throws if a given User does not exist', async () => {
    const matchId = randomId();
    const userId = randomId();
    const command = new JoinMatchCommand(matchId, [userId]);

    let foundError: ?Error = null;
    try {
      await command.execute();
    } catch (error) {
      foundError = error;
    }
    assert.instanceOf(foundError, UserNotFoundError);
  });
  it('throws if given Match does not exist', async () => {
    const matchId = randomId();
    const userId = await createUserId();
    const command = new JoinMatchCommand(matchId, [userId]);

    let foundError = null;
    try {
      await command.execute();
    } catch (error) {
      foundError = error;
    }
    assert.instanceOf(foundError, MatchNotFoundError);
  });
  it('throws if given Match has already started', async () => {
    const matchId = await createMatchId({ startTime: new Date() });
    const userId = await createUserId();
    const command = new JoinMatchCommand(matchId, [userId]);

    let foundError = null;
    try {
      await command.execute();
    } catch (error) {
      foundError = error;
    }
    assert.instanceOf(foundError, MatchAlreadyStartedError);
  });
  it('throws if given Match does not include all given players', async () => {
    const matchId = await createMatchId();
    const userId = await createUserId();
    const command = new JoinMatchCommand(matchId, [userId]);

    let foundError = null;
    try {
      await command.execute();
    } catch (error) {
      foundError = error;
    }
    assert.instanceOf(foundError, PlayersNotInMatchError);
  });
  it('adds joinTime to given players for given Match', async () => {
    const userId = await createUserId();
    const matchId = await createMatchId({ players: [{ userId }] });
    const command = new JoinMatchCommand(matchId, [userId]);
    await command.execute();

    const match = await Match.findById(matchId);
    if (!match) return; // make flow happy
    const player = match.getPlayer(userId);
    if (!player) throw new Error(); // make flow happy;
    assert.isOk(player.joinTime);
  });
  it('adds joinTime to given players for given Series if needed', async () => {
    const userId = await createUserId();
    const seriesId = await createSeriesId({ players: [{ userId }] });
    const matchId = await createMatchId({
      seriesId,
      players: [{ userId }],
      round: 0,
    });
    const command = new JoinMatchCommand(matchId, [userId]);
    await command.execute();

    const series = await Series.findById(seriesId);
    if (!series) return; // make flow happy
    const player = series.getPlayer(userId);
    if (!player) throw new Error(); // make flow happy;
    assert.isOk(player.joinTime);
  });
});
