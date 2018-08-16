// @flow
import { assert } from 'chai';
import {
  resetDb,
  randomId,
  createdIds,
  executionError,
  findMatchById,
  resetMatch,
} from '../testHelpers';
import {
  MatchNotFoundError,
  MatchNotStartedError,
  MatchAlreadyEndedError,
  PlayerNotActiveError,
  TurnNotYetStartedError,
  PlayerDoesNotHaveCards,
} from '../../src/utils/errors';
import DiscardCommand from '../../src/commands/DiscardCommand';

describe('commands/DiscardCommand', () => {
  before(() => resetDb());

  it('throws if given Match does not exist', async () => {
    const matchId = randomId();
    const userId = createdIds.user.basic1;
    const command = new DiscardCommand(matchId, userId, 'C9');

    const error = await executionError(command);
    assert.instanceOf(error, MatchNotFoundError);
  });
  it('throws if given Match has not yet started', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.notStarted0;
    const command = new DiscardCommand(matchId, userId, 'C9');

    const error = await executionError(command);
    assert.instanceOf(error, MatchNotStartedError);
  });
  it('throws if match has already ended', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.ended0;
    const command = new DiscardCommand(matchId, userId, 'C9');

    const error = await executionError(command);
    assert.instanceOf(error, MatchAlreadyEndedError);
  });
  it('throws if given User is not the active player', async () => {
    const userId = createdIds.user.basic0;
    const matchId = createdIds.match.started2;
    const command = new DiscardCommand(matchId, userId, 'C9');

    const error = await executionError(command);
    assert.instanceOf(error, PlayerNotActiveError);
  });
  it('throws if player does not have given cards', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started2;
    const command = new DiscardCommand(matchId, userId, 'CA');

    const error = await executionError(command);
    assert.instanceOf(error, PlayerDoesNotHaveCards);
  });
  it('throws if turn not yet started', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started1;
    const command = new DiscardCommand(matchId, userId, 'C9');

    const error = await executionError(command);
    assert.instanceOf(error, TurnNotYetStartedError);
  });
  it('removes given card from hand and puts into discard', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started2;
    await resetMatch('started2');
    const command = new DiscardCommand(matchId, userId, 'C9');
    await command.execute();

    const match = await findMatchById(matchId);
    assert(!match.playerHasCards(userId, ['C9']));
    assert.equal(match.lastDiscard, 'C9');
  });
  it('ends current turn', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started2;
    await resetMatch('started2');
    const command = new DiscardCommand(matchId, userId, 'C9');
    await command.execute();

    const match = await findMatchById(matchId);
    assert(!match.turnStarted);
    assert.equal(match.turn, 2);
  });
});
