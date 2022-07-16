/* eslint-disable no-restricted-syntax */
export function makeUiQueryObject(state) {
  const uiObj = {
    modals: [],
    drawers: [],
  };
  for (const name in state.modals) {
    if (state.modals[name]) {
      uiObj.modals.push(name);
    }
  }
  for (const name in state.drawers) {
    if (state.drawers[name]) {
      uiObj.drawers.push(name);
    }
  }
  if (state.product !== null) {
    uiObj.product = state.product;
  }
  if (state.post !== null) {
    uiObj.post = state.post;
  }
  if (state.category !== null) {
    uiObj.category = state.category;
  }
  if (state.shelf !== null) {
    uiObj.shelf = state.shelf;
  }
  if (state.address !== null) {
    uiObj.address = state.address;
  }
  return uiObj;
}
