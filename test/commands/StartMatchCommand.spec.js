// @flow
import { assert } from 'chai';
import {
  createDocuments,
  randomId,
  executionError,
  createdIds,
  resetDocuments,
  findMatchById,
  findSeriesById,
} from '../testHelpers';
import { MatchNotFoundError } from '../../src/utils/errors';
import StartMatchCommand, {
  NotAllPlayersJoinedError,
} from '../../src/commands/StartMatchCommand';

describe('commands/StartMatchCommand', () => {
  before(() => createDocuments({
    series: ['notStarted1', 'started1', 'notStarted0'],
    match: ['notStarted0', 'notStarted1', 'notStarted2'],
  }));

  describe('failure', () => {
    it('throws if given Match does not exist', async () => {
      const matchId = randomId();
      const command = new StartMatchCommand(matchId);

      const error = await executionError(command);
      assert.instanceOf(error, MatchNotFoundError);
    });
    it('throws if not all players in match have joined', async () => {
      const matchId = createdIds.match.notStarted0;
      const command = new StartMatchCommand(matchId);

      const error = await executionError(command);
      assert.instanceOf(error, NotAllPlayersJoinedError);
    });
  });

  describe('success', () => {
    let match;
    let series;
    before(async () => {
      await resetDocuments({
        match: 'notStarted1',
        series: 'notStarted1',
      });
      const matchId = createdIds.match.notStarted1;
      const seriesId = createdIds.series.notStarted1;
      const command = new StartMatchCommand(matchId);
      await command.execute();
      match = await findMatchById(matchId);
      assert.lengthOf(match.players, 3);
      series = await findSeriesById(seriesId);
    });

    it('sets some meta values', () => {
      assert.exists(match.startTime);
      assert(match.players.every(
        player => player.bet === null && 'blockedTurns' in player,
      ));
      assert.exists(series.startTime);
    });
    it('sets money values', () => {
      assert(match.players.every(({ pesos }) => pesos === -5));
      assert(series.players.every(({ pesos }) => pesos === -5));
      assert.equal(series.jackpot, 15);
    });
    it('sets card values', () => {
      match.players.forEach(({ hand, discard, melds }, index) => {
        assert.lengthOf(hand, index === 0 ? 13 : 12);
        assert.isEmpty(discard);
        if (!melds) throw new Error(); // make flow happy
        assert.isEmpty(melds.runs);
        assert.isEmpty(melds.sets);
      });
      assert.lengthOf(match.pile, 15);
    });
    it('does not start series already started', async () => {
      await resetDocuments({
        match: 'notStarted2',
        series: 'started1',
      });
      const matchId = createdIds.match.notStarted2;
      const seriesId = createdIds.series.started1;
      let series2 = await findSeriesById(seriesId);
      const { startTime: timeBeforeExec } = series2;

      const command = new StartMatchCommand(matchId);
      await command.execute();

      series2 = await findSeriesById(seriesId);
      if (!series2.startTime || !timeBeforeExec) throw new Error(); // make flow happy
      assert.equal(series2.startTime.getTime(), timeBeforeExec.getTime());
    });
  });
});
