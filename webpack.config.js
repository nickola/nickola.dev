const fs = require('fs');
const path = require('path');

// Settings
const HOME = path.resolve(__dirname);
const SOURCE = path.join(HOME, 'static', 'components');
const TARGET = path.join(HOME, 'static-build', 'components');

// Entries
const getEntries = directory => {
  const entries = {};

  for (const file of fs.readdirSync(directory)) {
    const name = path.parse(file).name;
    if (name) entries[name] = path.join(directory, file);
  }

  return entries;
};

// Configuration
module.exports = {
  mode: 'development',
  entry: getEntries(SOURCE),
  output: {path: TARGET, filename: '[name].js'},
  module: {
    rules: [
      {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader', options: {presets: ['@babel/preset-react']}}
    ]
  }
};
