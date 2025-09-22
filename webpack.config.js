const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Fallback for React Native modules that don't have web versions
  config.resolve.fallback = {
    ...config.resolve.fallback,
    'react-native': 'react-native-web',
  };

  // Use polyfills for missing React Native modules
  config.resolve.alias = {
    ...config.resolve.alias,
    'react-native': 'react-native-web',
    'react-native/Libraries/Utilities/Platform': path.resolve(__dirname, 'polyfills/Platform.js'),
    'react-native/Libraries/ReactNative/UIManager': path.resolve(__dirname, 'polyfills/UIManager.js'),
    'react-native/Libraries/Blob/BlobManager': path.resolve(__dirname, 'polyfills/BlobManager.js'),
    'react-native/Libraries/Components/Sound/SoundManager': path.resolve(__dirname, 'polyfills/SoundManager.js'),
    'react-native/Libraries/Alert/RCTAlertManager': path.resolve(__dirname, 'polyfills/RCTAlertManager.js'),
    'react-native/Libraries/StyleSheet/PlatformColorValueTypes': path.resolve(__dirname, 'polyfills/PlatformColorValueTypes.js'),
    'react-native/Libraries/Utilities/BackHandler': path.resolve(__dirname, 'polyfills/BackHandler.js'),
  };

  return config;
};