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
- BetCommand
- Change melds to be an array of { cards, type }
- rename commandHelpers
  - it's only export only helps match commands
- must sort hands when dealing
- must sort melds?
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
