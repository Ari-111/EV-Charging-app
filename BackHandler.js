// BackHandler polyfill for web
const BackHandler = {
  addEventListener: () => ({
    remove: () => {}
  }),
  removeEventListener: () => {},
  exitApp: () => {
    window.close();
  }
};

export default BackHandler;