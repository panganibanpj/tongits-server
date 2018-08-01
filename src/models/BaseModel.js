// @flow
import type { ObjectId } from 'mongoose';

export default class BaseModel /* :: extends Mongoose$Document */ {
  static async exists(id: ?ObjectId): Promise<boolean> {
    if (!id) return Promise.resolve(false);
    const doc = await this.findById(id, '_id', { lean: true });
    return !!doc;
  }

  // @NOTE: accessing model._id returns bson$ObjectId
  //  but only ObjectId is exported
  getId(): ObjectId {
    const { _id: id } = this;
    // $FlowFixMe
    return id;
  }
}
