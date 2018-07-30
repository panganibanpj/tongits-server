// @flow
import Match, { type MatchType } from '../models/MatchModel';
import NotEnoughPlayersError from '../utils/NotEnoughPlayersError';

export default class CreateMatchCommand {
  matchData: MatchType;

  constructor(matchData: MatchType) {
    // must have at least 1 player
    if (!matchData.players.length) throw new NotEnoughPlayersError();

    // can add more players later (e.g. players decline, matchmake is async)
    this.matchData = matchData;
  }

  execute(): Promise<Match> {
    // should create match? pending players can't see cards
    return Match.create(this.matchData);
  }
}
