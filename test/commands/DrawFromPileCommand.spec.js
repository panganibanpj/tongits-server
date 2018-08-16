// @flow
import { assert } from 'chai';
import {
  resetDb,
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
} from '../../src/utils/errors';
import DrawFromPileCommand from '../../src/commands/DrawFromPileCommand';
import type { CardType } from '../../src/types/deck';

describe('commands/DrawFromPileCommand', () => {
  before(() => resetDb());

  it('throws if given Match does not exist', async () => {
    const matchId = randomId();
    const userId = createdIds.user.basic1;
    const command = new DrawFromPileCommand(matchId, userId);

    const error = await executionError(command);
    assert.instanceOf(error, MatchNotFoundError);
  });
  it('throws if given Match has not yet started', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.notStarted0;
    const command = new DrawFromPileCommand(matchId, userId);

    const error = await executionError(command);
    assert.instanceOf(error, MatchNotStartedError);
  });
  it('throws if match has already ended', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.ended0;
    const command = new DrawFromPileCommand(matchId, userId);

    const error = await executionError(command);
    assert.instanceOf(error, MatchAlreadyEndedError);
  });
  it('throws if turn has already started', async () => {
    const userId = createdIds.user.basic0;
    const matchId = createdIds.match.started0;
    const command = new DrawFromPileCommand(matchId, userId);

    const error = await executionError(command);
    assert.instanceOf(error, TurnAlreadyStartedError);
  });
  it('throws if given User is not the active player', async () => {
    const userId = createdIds.user.basic0;
    const matchId = createdIds.match.started1;
    const command = new DrawFromPileCommand(matchId, userId);

    const error = await executionError(command);
    assert.instanceOf(error, PlayerNotActiveError);
  });
  it("adds the first card from the pile onto the active player's hand", async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started1;
    await resetMatch('started1');
    const command = new DrawFromPileCommand(matchId, userId);

    let match = await findMatchById(matchId);

    await command.execute();

    match = await findMatchById(matchId);
    const player = match.activePlayer();
    const activeHand = player.hand;
    const actualDrawnCard: CardType = activeHand[13];

    assert.lengthOf(match.pile, 13);
    assert.equal(actualDrawnCard, 'HQ');
    assert.deepEqual(
      [actualDrawnCard, ...match.pile],
      ['HQ', 'SA', 'S8', 'H8', 'DQ', 'D8', 'CQ', 'DK', 'S6', 'D9', 'D3', 'H6', 'S5', 'D6'],
    );
  });
  it('starts turn', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started1;
    await resetMatch('started1');
    const command = new DrawFromPileCommand(matchId, userId);

    await command.execute();

    const match = await findMatchById(matchId);
    assert(match.turnStarted);
  });
});
