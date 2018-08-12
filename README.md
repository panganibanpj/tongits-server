# tongits-server
Server API for Tong-its

## Roadmap
- ~platform~
- ~models~
- commands
- auth
- routes
- end2end

## TODO
- Should rematches start automatically?
- multiple active matches can exist for given series. consider an `activeMatch` field
- `blockedTurns === -1`
  - need to be able to block the current turn (player 2 blocks 1), when turn starts, `blockedTurns--` so player can't bet. then on next turn, -- should make it 0, indicating player can bet. match `ended0` sort of reflects this. Made it -1 'cuz it could be that sapaw only bumps blockedTurns by 1, then `blockedTurns === 0` means still blocked. until it goes down to -1
  - another option is blockedTurns could be the exact turn player was blocked. then oh bet, just have to check if enough turns have gone by since being blocked to bet
- must sort hands when dealing
- add tests to StartMatchCommand for 4 player deals
- DrawFromDiscardCommand must check if game should end
- limit players per match in InvitePlayerCommand
