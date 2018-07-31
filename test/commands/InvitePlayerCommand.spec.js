// @flow
import { assert } from 'chai';
import { Types, type BSONObjectId } from 'mongoose';
import User from '../../src/models/UserModel';
import Match from '../../src/models/MatchModel';
import Series from '../../src/models/SeriesModel';
import NotEnoughPlayersError from '../../src/utils/NotEnoughPlayersError';
import UserNotFoundError from '../../src/utils/UserNotFoundError';
import hasPlayers from '../../src/utils/hasPlayers';
import InvitePlayerCommand, {
  MatchNotFoundError,
  MatchAlreadyStartedError,
  SeriesAlreadyStartedError,
} from '../../src/commands/InvitePlayerCommand';

describe('commands/InvitePlayerCommand', () => {
  describe('constructor', () => {
    it('throws if not enough players', () => {
      const matchId = new Types.ObjectId();
      const userIds = [];
      assert.throws(
        () => new InvitePlayerCommand(matchId, userIds),
        NotEnoughPlayersError,
      );
    });
  });

  describe('execute', () => {
    const testExecutionError = async (
      matchId: BSONObjectId,
      userIds: Array<BSONObjectId>,
    ): Promise<?Error> => {
      const command = new InvitePlayerCommand(matchId, userIds);
      try {
        await command.execute();
      } catch (error) {
        return error;
      }
      return null;
    };
    it('throws if a given user does not exist', async () => {
      const matchId = new Types.ObjectId();
      const userId = new Types.ObjectId();
      const error = await testExecutionError(matchId, [userId]);
      assert.instanceOf(error, UserNotFoundError);
    });
    it('throws if given match does not exist', async () => {
      const matchId = new Types.ObjectId();
      const username = 'commands.InvitePlayerCommand.1';
      const user = await User.create({ username, isConnected: true });
      const error = await testExecutionError(matchId, [user.getId()]);
      assert.instanceOf(error, MatchNotFoundError);
    });
    it('throws if given match has already started', async () => {
      const match = await Match.create({
        seriesId: new Types.ObjectId(),
        startTime: new Date(),
      });
      const username = 'commands.InvitePlayerCommand.2';
      const user = await User.create({ username, isConnected: true });
      const error = await testExecutionError(match.getId(), [user.getId()]);
      assert.instanceOf(error, MatchAlreadyStartedError);
    });
    it('throws if not the first match', async () => {
      const match = await Match.create({
        seriesId: new Types.ObjectId(),
        round: 4,
      });
      const username = 'commands.InvitePlayerCommand.3';
      const user = await User.create({ username, isConnected: true });
      const error = await testExecutionError(match.getId(), [user.getId()]);
      assert.instanceOf(error, SeriesAlreadyStartedError);
    });
    it('adds players to series and match iff not already in it', async () => {
      const username = 'commands.InvitePlayerCommand.4';
      const user = await User.create({ username, isConnected: true });
      const series = await Series.create({ betType: 'BASIC' });
      const match = await Match.create({ seriesId: series.getId() });
      const username2 = 'commands.InvitePlayerCommand.5';
      const user2 = await User.create({
        username: username2,
        isConnected: true,
      });
      const error = await testExecutionError(match.getId(), [
        user.getId(),
        user2.getId(),
      ]);
      assert.isNotOk(error);

      await Promise.all([
        async () => {
          const sameSeries = await Series.findById(series.getId());
          if (!sameSeries) throw new Error();
          const players = sameSeries.players.map(({ userId }) => ({ userId }));
          assert(hasPlayers(players, [user2.getId()]));
          assert.lengthOf(players, 2);
        },
        async () => {
          const sameMatch = await Match.findById(match.getId());
          if (!sameMatch) throw new Error();
          const players = sameMatch.players.map(({ userId }) => ({ userId }));
          assert(hasPlayers(players, [user2.getId()]));
          assert.lengthOf(players, 2);
        },
      ]);
    });
  });
});
