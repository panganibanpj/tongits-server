// @flow
import { assert } from 'chai';
import {
  resetDb,
  randomId,
  executionError,
  createdIds,
  resetDocuments,
  findMatchById,
  findSeriesById,
} from '../testHelpers';
import {
  MatchNotFoundError,
  MatchAlreadyStartedError,
} from '../../src/utils/errors';
import StartMatchCommand, {
  NotAllPlayersJoinedError,
} from '../../src/commands/StartMatchCommand';

describe('commands/StartMatchCommand', () => {
  before(() => resetDb());

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
    it('throws if match has already started', async () => {
      const matchId = createdIds.match.started0;
      const command = new StartMatchCommand(matchId);

      const error = await executionError(command);
      assert.instanceOf(error, MatchAlreadyStartedError);
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
      assert(match.hasStarted);
      assert(series.hasStarted);
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
        assert.isEmpty(melds);
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

      const command = new StartMatchCommand(matchId);
      await command.execute();

      const series2 = await findSeriesById(seriesId);
      assert.equal(
        Number(series2.startTime),
        Number(new Date('2015-09-28T18:00:00.000Z')),
      );
    });
  });
});
