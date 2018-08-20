// @flow
import { assert } from 'chai';
import {
  resetDb,
  randomId,
  createdIds,
  executionError,
  resetMatch,
  findMatchById,
} from '../testHelpers';
import {
  CardsAreNotMeldError,
  MatchNotFoundError,
  MatchNotStartedError,
  MatchAlreadyEndedError,
  PlayerNotActiveError,
  PlayerDoesNotHaveCards,
  PlayersNotInMatchError,
  TurnNotYetStartedError,
} from '../../src/utils/errors';
import AppendMeldCommand, {
  PlayerMissingMeldInMatch,
} from '../../src/commands/AppendMeldCommand';

describe('commands/AppendMeldCommand', () => {
  before(() => resetDb());

  it('throws if given cards and target meld are not valid', () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started2;
    const targetUserId = createdIds.user.basic0;
    assert.throws(() => new AppendMeldCommand(
      matchId,
      userId,
      targetUserId,
      ['S9', 'S0', 'SJ'],
      ['HQ'],
    ), CardsAreNotMeldError);
  });
  it('throws if given Match does not exist', async () => {
    const matchId = randomId();
    const userId = createdIds.user.basic1;
    const targetUserId = createdIds.user.basic0;
    const command = new AppendMeldCommand(
      matchId,
      userId,
      targetUserId,
      ['S9', 'S0', 'SJ'],
      ['SQ'],
    );

    const error = await executionError(command);
    assert.instanceOf(error, MatchNotFoundError);
  });
  it('throws if given Match has not yet started', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.notStarted0;
    const targetUserId = createdIds.user.basic0;
    const command = new AppendMeldCommand(
      matchId,
      userId,
      targetUserId,
      ['S9', 'S0', 'SJ'],
      ['SQ'],
    );

    const error = await executionError(command);
    assert.instanceOf(error, MatchNotStartedError);
  });
  it('throws if match has already ended', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.ended0;
    const targetUserId = createdIds.user.basic0;
    const command = new AppendMeldCommand(
      matchId,
      userId,
      targetUserId,
      ['S9', 'S0', 'SJ'],
      ['SQ'],
    );

    const error = await executionError(command);
    assert.instanceOf(error, MatchAlreadyEndedError);
  });
  it('throws if given User is not the active player', async () => {
    const userId = createdIds.user.basic2;
    const matchId = createdIds.match.started2;
    const targetUserId = createdIds.user.basic0;
    const command = new AppendMeldCommand(
      matchId,
      userId,
      targetUserId,
      ['S9', 'S0', 'SJ'],
      ['SQ'],
    );

    const error = await executionError(command);
    assert.instanceOf(error, PlayerNotActiveError);
  });
  it('throws if player does not have given cards', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started2;
    const targetUserId = createdIds.user.basic0;
    const command = new AppendMeldCommand(
      matchId,
      userId,
      targetUserId,
      ['S9', 'S0', 'SJ'],
      ['S8'],
    );

    const error = await executionError(command);
    assert.instanceOf(error, PlayerDoesNotHaveCards);
  });
  it('throws if turn not yet started', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started1;
    const targetUserId = createdIds.user.basic0;
    const command = new AppendMeldCommand(
      matchId,
      userId,
      targetUserId,
      ['C8', 'C9', 'C0'],
      ['C7'],
    );

    const error = await executionError(command);
    assert.instanceOf(error, TurnNotYetStartedError);
  });
  it('throws if target player not in match', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started2;
    const targetUserId = createdIds.user.empty;
    const command = new AppendMeldCommand(
      matchId,
      userId,
      targetUserId,
      ['S9', 'S0', 'SJ'],
      ['SQ'],
    );

    const error = await executionError(command);
    assert.instanceOf(error, PlayersNotInMatchError);
  });
  it('throws if target player does not have target meld', async () => {
    const userId = createdIds.user.basic1;
    const matchId = createdIds.match.started2;
    const targetUserId = createdIds.user.basic0;
    const command = new AppendMeldCommand(
      matchId,
      userId,
      targetUserId,
      ['CQ', 'DQ', 'HQ'],
      ['SQ'],
    );

    const error = await executionError(command);
    assert.instanceOf(error, PlayerMissingMeldInMatch);
  });
  describe('success', () => {
    let userId;
    let matchId;
    let targetUserId;
    let match;
    before(async () => {
      userId = createdIds.user.basic1;
      matchId = createdIds.match.started2;
      targetUserId = createdIds.user.basic0;
      await resetMatch('started2');

      const command = new AppendMeldCommand(
        matchId,
        userId,
        targetUserId,
        ['S9', 'S0', 'SJ'],
        ['SQ'],
      );
      await command.execute();
      match = await findMatchById(matchId);
    });

    it("removes source cards from active player's hand and adds to target meld", () => {
      assert(!match.playerHasCards(userId, ['SQ']));
      const { melds: [{ cards: targetMeld }] } = match.getPlayer(targetUserId);
      assert.deepEqual(targetMeld, ['S9', 'S0', 'SJ', 'SQ']);
    });
    it('blocks target player', () => {
      assert(match.playerIsBlocked(targetUserId));
    });
    it('sets shouldEnd if active player runs out of cards', async () => {
      assert(!match.shouldEnd);

      const matchId2 = createdIds.match.started5;
      await resetMatch('started5');
      const command2 = new AppendMeldCommand(
        matchId2,
        userId,
        targetUserId,
        ['H9', 'H0', 'HJ'],
        ['H8'],
      );
      await command2.execute();
      const match2 = await findMatchById(matchId2);
      assert(match2.shouldEnd);
    });
  });
});
