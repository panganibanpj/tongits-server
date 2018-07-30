// @flow
import type { BSONObjectId } from 'mongoose';

export default class BaseModel /* :: extends Mongoose$Document */ {
  static async exists(id: ?BSONObjectId): Promise<boolean> {
    if (!id) return Promise.resolve(false);
    return !!(await this.findById(id, { _id: true }));
  }

  // @NOTE: accessing model._id returns bson$ObjectId, but only
  getId(): BSONObjectId {
    const { _id: id } = this;
    // $FlowFixMe
    return id;
  }
}
