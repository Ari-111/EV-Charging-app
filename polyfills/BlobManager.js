// BlobManager polyfill for web
const BlobManager = {
  isAvailable: false,
  addWebSocketHandler: () => {},
  removeWebSocketHandler: () => {},
  sendOverSocket: () => {},
  createFromParts: () => null,
  createFromOptions: () => null,
  release: () => {},
};

export default BlobManager;