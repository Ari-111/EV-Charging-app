// Crypto polyfill for React Native
if (typeof global !== 'undefined' && !global.crypto) {
  global.crypto = {};
}

if (typeof window !== 'undefined' && !window.crypto) {
  window.crypto = {};
}

// Polyfill for crypto.getRandomValues()
function getRandomValues(array) {
  if (!(array instanceof Uint8Array) && !(array instanceof Uint16Array) && 
      !(array instanceof Uint32Array) && !(array instanceof Int8Array) && 
      !(array instanceof Int16Array) && !(array instanceof Int32Array)) {
    throw new Error('Expected an integer array');
  }
  
  if (array.byteLength > 65536) {
    throw new Error('Can only request a maximum of 65536 bytes');
  }

  // Simple random number generation
  for (let i = 0; i < array.length; i++) {
    if (array instanceof Uint8Array) {
      array[i] = Math.floor(Math.random() * 256);
    } else if (array instanceof Uint16Array) {
      array[i] = Math.floor(Math.random() * 65536);
    } else if (array instanceof Uint32Array) {
      array[i] = Math.floor(Math.random() * 4294967296);
    } else if (array instanceof Int8Array) {
      array[i] = Math.floor(Math.random() * 256) - 128;
    } else if (array instanceof Int16Array) {
      array[i] = Math.floor(Math.random() * 65536) - 32768;
    } else if (array instanceof Int32Array) {
      array[i] = Math.floor(Math.random() * 4294967296) - 2147483648;
    }
  }
  
  return array;
}

// Add getRandomValues method to crypto object
const cryptoPolyfill = {
  getRandomValues: getRandomValues
};

if (typeof global !== 'undefined') {
  global.crypto = { ...global.crypto, ...cryptoPolyfill };
}

if (typeof window !== 'undefined') {
  window.crypto = { ...window.crypto, ...cryptoPolyfill };
}

export default cryptoPolyfill;