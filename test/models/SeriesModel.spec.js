// @flow
import { assert } from 'chai';
import { Types } from 'mongoose';
import Series from '../../src/models/SeriesModel';

describe('models/SeriesModel', () => {
  describe('hasPlayer', () => {
    let players;
    let series;
    before(async () => {
      players = [{ userId: new Types.ObjectId() }];
      series = await Series.create({
        betType: 'BASIC',
        players,
      });
    });

    it('returns true if given userId is one of players in series', () => {
      const [{ userId }] = players;
      assert(series.hasPlayer(userId));
    });

    it('returns false otherwise', () => {
      const userId = new Types.ObjectId();
      assert(!series.hasPlayer(userId));
      assert(!series.hasPlayer());
      assert(!series.hasPlayer(null));
    });
  });

  describe('hasPlayers', () => {
    let players;
    let series;
    before(async () => {
      players = [
        { userId: new Types.ObjectId() },
        { userId: new Types.ObjectId() },
      ];
      series = await Series.create({
        betType: 'BASIC',
        players,
      });
    });

    it('returns true if all given userIds are players in series', () => {
      const userIds = players.map(({ userId }) => userId);
      assert(series.hasPlayers(userIds));
    });

    it('returns false otherwise', () => {
      const userIds = players.map(({ userId }) => userId);
      userIds.push(new Types.ObjectId());
      assert(!series.hasPlayers(userIds));
      assert(!series.hasPlayers([]));
      assert(!series.hasPlayers());
    });
  });
});
