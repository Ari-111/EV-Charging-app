// Platform polyfill for web
const Platform = {
  OS: 'web',
  Version: 0,
  isTesting: false,
  select: (specifics) => {
    if (typeof specifics === 'object') {
      return specifics.web || specifics.default || null;
    }
    return specifics;
  },
  constants: {
    reactNativeVersion: {
      major: 0,
      minor: 72,
      patch: 10,
    },
  },
};

export default Platform;