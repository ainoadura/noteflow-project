// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const { pathToFileURL } = require('url');

const config = getDefaultConfig(__dirname);

module.exports = config;
