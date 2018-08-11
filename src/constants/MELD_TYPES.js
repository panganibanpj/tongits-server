// @flow
export const RUN_MELD = 'RUN_MELD';
export const SET_MELD = 'SET_MELD';
export default {
  RUN_MELD,
  SET_MELD,
};
export type MeldType = typeof RUN_MELD | typeof SET_MELD;
