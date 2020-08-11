const fs = require('fs');
const os = require('os');
const toml = require('toml');

const { SRC_ROOT_DIR } = require('./config');

function getEnv () {
  const { mode, env = 'local' } = require('yargs').argv;

  if (mode === 'development' && !['local', 'dev', 'pro'].includes(env)) {
    console.error(`请使用一下命令：\n\nnpm start -- --env {env} # env 为启动环境，可选：local/dev/pro\n\n`);
    process.exit(-1);
  }

  if (mode === 'production' && !['local', 'dev', 'pro'].includes(env)) {
    console.error(`请使用一下命令：\n\nnpm run build -- --env {env} # env 为启动环境，可选：dev/pro\n\n`);
    process.exit(-1);
  }

  return { mode, env };
}

exports.getEnv = getEnv;

exports.getConfig = function getConfig () {
  return toml.parse(fs.readFileSync(`${SRC_ROOT_DIR}/config.toml`));
};

exports.mergeConfig = function mergeConfig (config) {
  for (const [key, value] of Object.entries(config)) {
    config[key] = { ...value.common, ...value[getEnv().env] };
  }
  return config;
};

/** 把 config json 文件生成 typings 文件 字符串 */
exports.getConfigTypings = function getConfigTypings (config, indent = 1, paths = '') {
  const types = {};
  if (types[paths]) {
    return types[paths];
  }
  if (['number', 'boolean', 'string', 'undefined'].includes(typeof config)) {
    return typeof config;
  }
  if (Array.isArray(config)) {
    return config.length ? `Array<${[...new Set(config.map((item, index) => getConfigTypings(item, indent, `${paths}[${index}]`)))].join(' | ')}>` : 'Array<string>';
  }
  return `{${Object.entries(config).reduce((p, [key, value]) => `${p}${os.EOL}${'  '.repeat(indent)}${key.includes('-') ? `'${key}'` : key}: ${getConfigTypings(value, indent + 1, `${paths}${paths && '.'}${key}`)};`, '')}${os.EOL}${'  '.repeat(indent - 1)}}`;
};

/** 给主题添加配置 */
exports.addPrefixForObjectKey = function addPrefixForObjectKey (obj = {}, prefix = '') {
  return Object.entries(obj).reduce((p, [key, value]) => ({ ...p, [`${prefix}${key}`]: value }), {});
};
