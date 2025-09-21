// UIManager polyfill for web
const UIManager = {
  measure: () => {},
  measureInWindow: () => {},
  measureLayout: () => {},
  measureLayoutRelativeToParent: () => {},
  focus: () => {},
  blur: () => {},
  getViewManagerConfig: () => null,
  hasViewManagerConfig: () => false,
  setJSResponder: () => {},
  clearJSResponder: () => {},
  configureNextLayoutAnimation: () => {},
  removeSubviewsFromContainerWithID: () => {},
  replaceExistingNonRootView: () => {},
  setChildren: () => {},
  manageChildren: () => {},
  createView: () => {},
  updateView: () => {},
  removeRootView: () => {},
  removeSubviews: () => {},
  replaceExistingNonRootView: () => {},
};

export default UIManager;