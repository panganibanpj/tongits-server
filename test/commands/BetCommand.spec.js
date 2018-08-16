// @flow
import { assert } from 'chai';
import {
  createDocuments,
  randomId,
  createdIds,
  executionError,
  resetMatch,
  findMatchById,
  equalIds,
} from '../testHelpers';
import {
  MatchNotFoundError,
  MatchNotStartedError,
  MatchAlreadyEndedError,
  PlayerNotActiveError,
  TurnAlreadyStartedError,
  PlayerDoesNotHaveCards,
} from '../../src/utils/errors';
import BetCommand, {
  PlayerHasNoMeldsError,
  PlayerIsBlockedError,
} from '../../src/commands/BetCommand';

describe('commands/BetCommand', () => {
  before(() => createDocuments({
    user: ['basic1'],
    match: [
      'notStarted0',
      'ended0',
      'started2',
      'started0',
      'started1',
      'started3',
      'started4',
    ],
  }));

  it('throws if given Match does not exist', async () => {
    const matchId = randomId();
    const userId = createdIds.user.basic1;
    const command = new BetCommand(matchId, userId);

    const error = await executionError(command);
    assert.instanceOf(error, MatchNotFoundError);
  });
  it('throws if given Match has not yet started', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.notStarted0;
    const command = new BetCommand(matchId, userId);

    const error = await executionError(command);
    assert.instanceOf(error, MatchNotStartedError);
  });
  it('throws if match has already ended', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.ended0;
    const command = new BetCommand(matchId, userId);

    const error = await executionError(command);
    assert.instanceOf(error, MatchAlreadyEndedError);
  });
  it('throws if given User is not the active player', async () => {
    const userId = createdIds.user.basic0;
    const matchId = createdIds.match.started2;
    const command = new BetCommand(matchId, userId);

    const error = await executionError(command);
    assert.instanceOf(error, PlayerNotActiveError);
  });
  it('throws if turn has already started', async () => {
    const userId = createdIds.user.basic0;
    const matchId = createdIds.match.started0;
    const command = new BetCommand(matchId, userId);

    const error = await executionError(command);
    assert.instanceOf(error, TurnAlreadyStartedError);
  });
  it('throws if active player has no melds', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started1;
    const command = new BetCommand(matchId, userId);

    const error = await executionError(command);
    assert.instanceOf(error, PlayerHasNoMeldsError);
  });
  it('throws if active player is blocked', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started4;
    const command = new BetCommand(matchId, userId);

    const error = await executionError(command);
    assert.instanceOf(error, PlayerIsBlockedError);
  });
  it('sets better for match and player.bet', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started3;
    await resetMatch('started3');
    const command = new BetCommand(matchId, userId);
    await command.execute();

    const match = await findMatchById(matchId);
    assert.exists(match.better);
    assert(equalIds(match.better || randomId(), userId));
    const player = match.getPlayer(userId);
    if (!player) throw new Error();
    assert(player.bet);
  });
});
