# tongits-server
Server API for Tong-its

## Roadmap
- ~platform~
- ~models~
- commands
- auth
- routes
  - sockets?
- e2e tests

## TODO
- Commands w CardType[] args should guarantee uniqueness
- BetCommand
  - `player.bet = true`
  - players can respond to bet in parallel
  - don't iterate turns
  - update commands to to validate that active player has not bet
- tests for unblocking players on draw commands
- rename commandHelpers
  - it's only export only helps match commands
- must sort hands when dealing
- must sort melds?
- break down MatchModel. too many methods, file is getting big
- try making constants JSON files into JS to make flow happier in some cases
- add tests to StartMatchCommand for 4 player deals
- limit players per match in InvitePlayerCommand
- JoinMatchCommand test not-first round (no dupe/override players in Series)
- Meld, AppendMeld, and Discard are all commands that don't _need_ to run on the server (turn-based API vs component-based API)
- test MeldCommand (DrawFromDiscardCommand?) w 4-card sets and longer straights
- throw error StartMatchCommand on round 0 but Series already started?
- undo commands
- Should rematches start automatically?
  - maybe matches are created automatically but don't start until all players accept
- multiple active matches can exist for given series. consider an `activeMatch` field
