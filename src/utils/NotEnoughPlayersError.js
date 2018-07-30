// @flow

export default class NotEnoughPlayersError extends RangeError {
  constructor() {
    super('Requires at least 1 player');
  }
}
