const fs = require('fs');
const os = require('os');
const toml = require('toml');

const { SRC_ROOT_DIR } = require('./config');

exports.getConfig = function getConfig () {
  return toml.parse(fs.readFileSync(`${SRC_ROOT_DIR}/config.toml`));
};

exports.mergeConfig = function mergeConfig (config) {
  for (const [key, value] of Object.entries(config)) {
    config[key] = { ...value.common, ...value.dev };
  }
  return config;
};

/** 把 config json 文件生成 typings 文件 字符串 */
exports.getConfigTypings = function getConfigTypings (config, indent = 1, paths = '') {
  const types = {};
  if (types[paths]) {
    return types[paths];
  }
  if (['number', 'boolean', 'string', 'null', 'undefined'].includes(typeof config)) {
    return typeof config;
  }
  if (Array.isArray(config)) {
    return config.length ? `Array<${[...new Set(config.map((item, index) => getConfigTypings(item, indent, `${paths}[${index}]`)))].join(' | ')}>` : 'Array<string>';
  }
  return `{${Object.entries(config).reduce((p, [key, value]) => `${p}${os.EOL}${'  '.repeat(indent)}${key.includes('-') ? `'${key}'` : key}: ${getConfigTypings(value, indent + 1, `${paths}${paths && '.'}${key}`)};`, '')}${os.EOL}${'  '.repeat(indent - 1)}}`;
};
