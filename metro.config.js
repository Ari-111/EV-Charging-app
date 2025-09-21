const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add web-specific resolver configuration
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add alias for better web compatibility
config.resolver.alias = {
  'react-native$': 'react-native-web',
};

// Ensure web assets are handled properly
config.resolver.assetExts.push('svg');

module.exports = config;