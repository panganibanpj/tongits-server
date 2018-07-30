// @flow
import type { MongoId } from 'mongoose';

export default class BaseModel /* :: extends Mongoose$Document */ {
  static async exists(id: ?MongoId): Promise<boolean> {
    if (!id) return Promise.resolve(false);
    return !!(await this.findById(id, { _id: true }));
  }

  // @NOTE: accessing model._id returns bson$ObjectId, but only
  getId(): MongoId {
    const { _id: id } = this;
    // $FlowFixMe
    return id;
  }
}
