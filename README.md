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
- tests for unblocking players on draw commands
- Call, Fold commands
- last bunot (DiscardCommand) shouldEnd
- draw commands should validate that active player has not bet
- WinnerCommand
- must sort hands when dealing
- create TongItsClient for invoking the commands
  - good way to abstract triggering WinnerCommand (on shouldEnd), logging, creating ObjectIds from strings, and history
  - maybe all commands should only throw on executes (remove constructor validations)
- break down MatchModel. too many methods, file is getting big
- try making constants JSON files into JS to make flow happier in some cases
- Commands w CardType[] args should guarantee uniqueness
- add tests to StartMatchCommand for 4 player deals
- JoinMatchCommand test not-first round (no dupe/override players in Series)
- test MeldCommand (DrawFromDiscardCommand?) w 4-card sets and longer straights
- should throw error in StartMatchCommand on round 0 but Series already started
- undo commands
- must sort melds?
- limit players per match in InvitePlayerCommand
- Meld, AppendMeld, and Discard are all commands that don't _need_ to run on the server (turn-based API vs component-based API)
- Should rematches start automatically?
  - maybe matches are created automatically but don't start until all players accept
- multiple active matches can exist for given series. consider an `activeMatch` field
