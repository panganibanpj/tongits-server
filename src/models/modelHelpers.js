// @flow
import type { ObjectId } from 'mongoose';


export const includesId = (ids: ObjectId[], id: ObjectId): boolean => {
  const idString = id.toString();
  const equalsIdString = anotherIdString => anotherIdString === idString;
  return ids.some(equalsIdString);
};

export default {
  includesId,
};
