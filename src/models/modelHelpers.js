// @flow
import type { ObjectId } from 'mongoose';
import type { CardType } from '../types/deck';

export const pluckUserIds = (
  players: Object[],
): ObjectId[] => players.map(({ userId }) => userId);

export const equalIds = (
  id1: ObjectId,
  id2: ObjectId,
): boolean => id1.toString() === id2.toString();

export const includesId = (
  ids: ObjectId[],
  id: ObjectId,
): boolean => ids.some(someId => equalIds(someId, id));

export const cardsetsMatch = (
  aCards: CardType[],
  bCards: CardType[],
) => aCards.length === bCards.length
    && bCards.every((card: CardType) => aCards.includes(card));
