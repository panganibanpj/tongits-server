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
} from '../../src/utils/errors';
import DrawCardCommand, {
  TurnAlreadyStartedError,
} from '../../src/commands/DrawCardCommand';
import type { CardType } from '../../src/types/deck';

describe('commands/DrawCardCommand', () => {
  before(() => createDocuments({
    user: ['basic1', 'basic0'],
    match: ['notStarted0', 'ended0', 'started0', 'started1'],
  }));

  it('throws if given Match does not exist', async () => {
    const matchId = randomId();
    const userId = createdIds.user.basic1;
    const command = new DrawCardCommand(matchId, userId);

    const error = await executionError(command);
    assert.instanceOf(error, MatchNotFoundError);
  });
  it('throws if given Match has not yet started', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.notStarted0;
    const command = new DrawCardCommand(matchId, userId);

    const error = await executionError(command);
    assert.instanceOf(error, MatchNotStartedError);
  });
  it('throws if match has already ended', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.ended0;
    const command = new DrawCardCommand(matchId, userId);

    const error = await executionError(command);
    assert.instanceOf(error, MatchAlreadyEndedError);
  });
  it('throws if turn has already started', async () => {
    const userId = createdIds.user.basic0;
    const matchId = createdIds.match.started0;
    const command = new DrawCardCommand(matchId, userId);

    const error = await executionError(command);
    assert.instanceOf(error, TurnAlreadyStartedError);
  });
  it('throws if given User is not the active player', async () => {
    const userId = createdIds.user.basic0;
    const matchId = createdIds.match.started1;
    const command = new DrawCardCommand(matchId, userId);

    const error = await executionError(command);
    assert.instanceOf(error, PlayerNotActiveError);
  });
  it("adds the first card from the pile onto the active player's hand", async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started1;
    await resetMatch('started1');
    const command = new DrawCardCommand(matchId, userId);

    let match = await findMatchById(matchId);
    if (!match.pile) throw new Error(); // make flow happy
    const { pile: pileBeforeDraw } = match;
    const expectedDrawnCard: CardType = pileBeforeDraw[0];

    await command.execute();

    match = await findMatchById(matchId);
    const player = match.activePlayer();
    if (!player.hand) throw new Error(); // make flow happy
    const { hand: activeHand } = player;
    const actualDrawnCard: CardType = activeHand[13];

    assert.lengthOf(pileBeforeDraw, 14);
    assert.lengthOf(match.pile, 13);
    assert.equal(expectedDrawnCard, actualDrawnCard);
    assert.deepEqual([actualDrawnCard].concat(match.pile), pileBeforeDraw);
  });
  it('starts turn', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started1;
    await resetMatch('started1');
    const command = new DrawCardCommand(matchId, userId);

    await command.execute();

    const match = await findMatchById(matchId);
    assert(match.turnStarted);
  });
});
