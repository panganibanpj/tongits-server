// @flow
import { assert } from 'chai';
import mongoose, { Schema } from 'mongoose';
import BaseModel from '../../src/models/BaseModel';

describe('models/BaseModel', () => {
  describe('static exists', () => {
    const TestSchema = new Schema({ foo: String });
    TestSchema.loadClass(class TestModel extends BaseModel { foo: string; });
    const Test = mongoose.model('base-extension', TestSchema);

    it('returns true user exists', async () => {
      const docConstructor = { foo: 'BaseModel.static exists.test1' };
      await Test.create(docConstructor);
      const doc = await Test.findOne(docConstructor).exec();
      if (!doc) throw new Error('create and find failed');

      const exists = await Test.exists(doc.getId());
      assert(exists);
    });

    it('returns false for falsy user ids', () => Promise.all([
      Test.exists().then(exists => assert(!exists)),
      Test.exists(null).then(exists => assert(!exists)),
    ]));
  });
});
