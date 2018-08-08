// @flow
import { assert } from 'chai';
import {
  randomId,
  createUserId,
  createMatchId,
  createSeriesId,
} from '../testHelpers';
import Series from '../../src/models/SeriesModel';
import {
  MatchNotFoundError,
  SeriesNotFoundError,
} from '../../src/utils/errors';
import StartMatchCommand, {
  NotAllPlayersJoinedError,
} from '../../src/commands/StartMatchCommand';

describe('commands/StartMatchCommand', () => {
  describe('failure', () => {
    it('throws if given Match does not exist', async () => {
      const matchId = randomId();
      const command = new StartMatchCommand(matchId);

      let foundError = null;
      try {
        await command.execute();
      } catch (error) {
        foundError = error;
      }
      assert.instanceOf(foundError, MatchNotFoundError);
    });
    it('throws if not all players in match have joined', async () => {
      const userId = await createUserId();
      const matchId = await createMatchId({ players: [{ userId }] });
      const command = new StartMatchCommand(matchId);

      let foundError = null;
      try {
        await command.execute();
      } catch (error) {
        foundError = error;
      }
      assert.instanceOf(foundError, NotAllPlayersJoinedError);
    });
    it('throws if given Series for match does not exist', async () => {
      const userId = await createUserId();
      const matchId = await createMatchId({
        seriesId: randomId(),
        players: [{ userId, joinTime: new Date() }],
      });
      const command = new StartMatchCommand(matchId);

      let foundError = null;
      try {
        await command.execute();
      } catch (error) {
        foundError = error;
      }
      assert.instanceOf(foundError, SeriesNotFoundError);
    });
  });

  describe('success', () => {
    let match;
    let series;
    before(async () => {
      const userIds = [
        await createUserId(),
        await createUserId(),
        await createUserId(),
      ];
      const seriesId = await createSeriesId({
        betType: 'BASIC',
        jackpot: 1234,
        players: userIds.map(userId => ({ userId })),
      });
      const matchId = await createMatchId({
        seriesId,
        players: userIds.map(userId => ({ userId, joinTime: new Date() })),
      });
      const command = new StartMatchCommand(matchId);
      match = await command.execute();
      if (!match) throw new Error(); // make flow happy
      assert.lengthOf(match.players, 3);
      series = await Series.findById(match.seriesId);
    });

    it('sets some meta values', () => {
      assert.exists(match.startTime);
      assert(match.players.every(
        player => player.bet === null && 'blockedTurns' in player,
      ));

      if (!series) throw new Error(); // make flow happy
      assert.exists(series.startTime);
    });
    it('sets money values', () => {
      assert(match.players.every(({ pesos }) => pesos === -5));

      if (!series) throw new Error(); // make flow happy
      assert(series.players.every(({ pesos }) => pesos === -5));
      assert(series.jackpot === 1249);
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
    it('does not set series.startTime if series already started', async () => {
      const { seriesId, players } = match;
      const matchId = await createMatchId({
        seriesId,
        players: players.map(({ userId }) => ({
          userId,
          joinTime: new Date(),
        })),
      });
      if (!series) throw new Error(); // make flow happy
      const { startTime } = series;

      const command = new StartMatchCommand(matchId);
      await command.execute();

      assert.equal(series.startTime, startTime);
    });
  });
});
