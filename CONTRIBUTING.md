### Source
- only models should make changes to data via methods
- commands will call those methods
- routes will invoke commands. can be http or socket
- commands should have undo
- commands validate business logic

### Tests
- memory mongodb database is created
- use `resetDb()` to reset it
- can reset individual documents
- reset is based on JSON files
- access `createdIds` to reference test JSON documents
- use `randomId()` to create IDs not associated to any created documents
- flow validates method calls
- don't need to test models. indirect method calls and real mongo queries (to memory db) should suffice
- thus, coverage should show what code is not actually needed
