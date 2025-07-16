// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Optional: allow binary + tokenizer files if you plan to use them later
config.resolver.assetExts.push('bin');
config.resolver.assetExts.push('pte');
config.resolver.assetExts.push('png'); // for navigation assets

module.exports = config;
