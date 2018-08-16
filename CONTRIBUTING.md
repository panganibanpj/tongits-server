### Source
- only models should make changes to data via methods
- commands will call those methods
- routes will invoke commands. can be http or socket
- commands should have undo
- commands validate business logic

### Tests
- memory mongodb database is created
- use `resetDocuments()` to reset from JSON files
- access `createdIds` to reference test JSON documents
- use `randomId()` to create IDs not associated to any created documents
- flow validates method calls
- there's a slight gap between what flow believes to be true and model defaults
  - specifically, you can create a document from a model with almost no fields (`e.g. Match.create({})`)
  - thus this all the properties of `Match` class are optional
  - however, schemas will set some defaults e.g. `Match.melds.defaults = {}`
  - thus `const match = await Match.create({});` => `match.melds === {}`
  - but since we call it optional on `Match` class, flow thinks `match.melds` may not exist
  - this happens quite a bit w `players` arrays and in test files where there's a lot of field access
  - you'll see lots of `// make flow happy` comments indicating that the line only exists to get around a flow error and probably would never trigger
  - The point of making them all optional was to create instances w/o setting any keys. now that mostly use test data, this will almost never be the case (except Create commands)
- don't need to test models. indirect method calls and real mongo queries (to memory db) should suffice
- thus, coverage should show what code is not actually needed
- try to make tests that can pass/fail independent of order
  - validations don't always need to run in a specific order so it's easiest to assume that the validation being tested should pass/fail any time as long as the specific conditions are met
  - e.g. `it('throws if match has not started')` and `it('throws if match has already ended')` should pass/fail independently not that the `match has already ended` check will fail iff `match has not started` passes
