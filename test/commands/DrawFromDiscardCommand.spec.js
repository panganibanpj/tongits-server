// @flow
import { assert } from 'chai';
import {
  createDocuments,
  randomId,
  executionError,
  createdIds,
  resetMatch,
  findMatchById,
} from '../testHelpers';
import {
  MatchNotFoundError,
  MatchNotStartedError,
  MatchAlreadyEndedError,
  PlayerNotActiveError,
  TurnAlreadyStartedError,
  PlayerDoesNotHaveCards,
  CardsAreNotMeldError,
} from '../../src/utils/errors';
import DrawFromDiscardCommand from '../../src/commands/DrawFromDiscardCommand';

describe('commands/DrawFromDiscardCommand', () => {
  before(() => createDocuments({
    user: ['basic1', 'basic0'],
    match: ['notStarted0', 'ended0', 'started0', 'started1', 'started3'],
  }));

  it('throws if not enough cards', () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started1;
    assert.throws(() => new DrawFromDiscardCommand(matchId, userId, []));
  });
  it('throws if given Match does not exist', async () => {
    const matchId = randomId();
    const userId = createdIds.user.basic1;
    const command = new DrawFromDiscardCommand(matchId, userId, ['C3', 'C4']);

    const error = await executionError(command);
    assert.instanceOf(error, MatchNotFoundError);
  });
  it('throws if given Match has not yet started', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.notStarted0;
    const command = new DrawFromDiscardCommand(matchId, userId, ['C3', 'C4']);

    const error = await executionError(command);
    assert.instanceOf(error, MatchNotStartedError);
  });
  it('throws if match has already ended', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.ended0;
    const command = new DrawFromDiscardCommand(matchId, userId, ['C3', 'C4']);

    const error = await executionError(command);
    assert.instanceOf(error, MatchAlreadyEndedError);
  });
  it('throws if given User is not the active player', async () => {
    const userId = createdIds.user.basic0;
    const matchId = createdIds.match.started1;
    const command = new DrawFromDiscardCommand(matchId, userId, ['C3', 'C4']);

    const error = await executionError(command);
    assert.instanceOf(error, PlayerNotActiveError);
  });
  it('throws if player does not have given cards', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started1;
    const command = new DrawFromDiscardCommand(matchId, userId, ['C4', 'CQ']);

    const error = await executionError(command);
    assert.instanceOf(error, PlayerDoesNotHaveCards);
  });
  it('throws if turn has already started', async () => {
    const userId = createdIds.user.basic0;
    const matchId = createdIds.match.started0;
    const command = new DrawFromDiscardCommand(matchId, userId, ['C6', 'C7']);

    const error = await executionError(command);
    assert.instanceOf(error, TurnAlreadyStartedError);
  });
  xit('throws if no last discarded card'); // i don't think this is possible
  it('throws if attempted meld is not valid', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started1;
    const command = new DrawFromDiscardCommand(matchId, userId, ['C4', 'C9']);

    const error = await executionError(command);
    assert.instanceOf(error, CardsAreNotMeldError);
  });
  it("combines the given cards with the last discarded and adds to active players' melds", async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started1;

    await resetMatch('started1');
    let command = new DrawFromDiscardCommand(matchId, userId, ['C3', 'C4']);
    await command.execute();
    let match = await findMatchById(matchId);
    if (!match) throw new Error(); // make flow happy
    let previousPlayer = match.previousPlayer();
    let activePlayer = match.activePlayer();
    assert.lengthOf(previousPlayer.discard, 0);
    let { hand } = activePlayer;
    if (!hand) throw new Error(); // make flow happy
    assert.notInclude(hand, 'C3');
    assert.notInclude(hand, 'C4');
    assert.deepEqual((activePlayer.melds || {}).runs[0], ['C3', 'C4', 'C5']);

    await resetMatch('started1');
    command = new DrawFromDiscardCommand(matchId, userId, ['D5', 'H5']);
    await command.execute();
    match = await findMatchById(matchId);
    if (!match) throw new Error(); // make flow happy
    previousPlayer = match.previousPlayer();
    activePlayer = match.activePlayer();
    assert.lengthOf(previousPlayer.discard, 0);
    ({ hand } = activePlayer);
    if (!hand) throw new Error(); // make flow happy
    assert.notInclude(hand, 'D5');
    assert.notInclude(hand, 'H5');
    assert.deepEqual((activePlayer.melds || {}).sets.FIVE, ['D5', 'H5', 'C5']);
  });
  it('starts turn', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started1;
    await resetMatch('started1');
    const command = new DrawFromDiscardCommand(matchId, userId, ['C3', 'C4']);

    await command.execute();

    const match = await findMatchById(matchId);
    assert(match.turnStarted);
  });
  it('sets match.shouldEnd if drawing will result in tong-its', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started3;
    await resetMatch('started3');
    const command = new DrawFromDiscardCommand(matchId, userId, ['C3', 'C4', 'C6', 'C7']);

    await command.execute();

    const match = await findMatchById(matchId);
    assert(match.shouldEnd);
  });
});
