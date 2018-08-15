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
  TurnNotYetStartedError,
  PlayerDoesNotHaveCards,
  CardsAreNotMeldError,
} from '../../src/utils/errors';
import MeldCommand from '../../src/commands/MeldCommand';

describe('commands/MeldCommand', () => {
  before(() => createDocuments({
    user: ['basic1', 'basic0'],
    match: ['started2', 'notStarted0', 'ended0', 'started0', 'started1'],
  }));

  it('throws if not enough cards', () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started2;
    assert.throws(() => new MeldCommand(matchId, userId, []));
  });
  it('throws if given Match does not exist', async () => {
    const matchId = randomId();
    const userId = createdIds.user.basic1;
    const command = new MeldCommand(matchId, userId, ['C9', 'C0', 'CJ']);

    const error = await executionError(command);
    assert.instanceOf(error, MatchNotFoundError);
  });
  it('throws if given Match has not yet started', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.notStarted0;
    const command = new MeldCommand(matchId, userId, ['C9', 'C0', 'CJ']);

    const error = await executionError(command);
    assert.instanceOf(error, MatchNotStartedError);
  });
  it('throws if match has already ended', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.ended0;
    const command = new MeldCommand(matchId, userId, ['C9', 'C0', 'CJ']);

    const error = await executionError(command);
    assert.instanceOf(error, MatchAlreadyEndedError);
  });
  it('throws if given User is not the active player', async () => {
    const userId = createdIds.user.basic0;
    const matchId = createdIds.match.started2;
    const command = new MeldCommand(matchId, userId, ['C9', 'C0', 'CJ']);

    const error = await executionError(command);
    assert.instanceOf(error, PlayerNotActiveError);
  });
  it('throws if player does not have given cards', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started2;
    const command = new MeldCommand(matchId, userId, ['C0', 'CJ', 'CQ']);

    const error = await executionError(command);
    assert.instanceOf(error, PlayerDoesNotHaveCards);
  });
  it('throws if turn not yet started', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started1;
    const command = new MeldCommand(matchId, userId, ['C9', 'C0', 'CJ']);

    const error = await executionError(command);
    assert.instanceOf(error, TurnNotYetStartedError);
  });
  it('throws if attempted meld is not valid', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started2;
    const command = new MeldCommand(matchId, userId, ['C4', 'C9', 'C0']);

    const error = await executionError(command);
    assert.instanceOf(error, CardsAreNotMeldError);
  });
  it('removes given cards from hand and adds to melds', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started2;

    await resetMatch('started2');
    let command = new MeldCommand(matchId, userId, ['C9', 'C0', 'CJ']);
    await command.execute();
    let match = await findMatchById(matchId);
    assert(['C9', 'C0', 'CJ'].every((card) => {
      const playerHasCard = match.playerHasCards(userId, [card]);
      return !playerHasCard;
    }));
    const [{ cards: run }] = match.players[1].melds || [];
    assert.deepEqual(run, ['C9', 'C0', 'CJ']);

    await resetMatch('started2');
    command = new MeldCommand(matchId, userId, ['C2', 'D2', 'S2']);
    await command.execute();
    match = await findMatchById(matchId);
    assert(['C2', 'D2', 'S2'].every((card) => {
      const playerHasCard = match.playerHasCards(userId, [card]);
      return !playerHasCard;
    }));
    const [{ setRank, cards }] = match.players[1].melds || [];
    assert.equal(setRank, 'TWO');
    assert.deepEqual(cards, ['C2', 'D2', 'S2']);
  });
});
