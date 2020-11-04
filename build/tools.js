const fs = require('fs');
const os = require('os');
const toml = require('toml');
const { mode, env = 'local' } = require('yargs').argv;

const envs = (mode === 'development' ? ['local'] : []).concat(['dev', 'pro']);

const { SRC_ROOT_DIR } = require('./config');

function getEnv () {
  if (!envs.includes(env)) {
    throw new Error(`请使用一下命令：\n\nnpm ${mode === 'development' ? 'start' : 'run build'} -- --env {env} # env 为启动环境，可选：${envs.join('/')}\n\n`);
  }

  return { mode, env };
}

exports.getEnv = getEnv;

exports.getConfig = function getConfig (config = toml.parse(fs.readFileSync(`${SRC_ROOT_DIR}/config.toml`))) {
  const { env, mode } = getEnv();
  for (const [key, value] of Object.entries(config)) {
    if (['env', 'model'].includes(key)) {
      throw new Error(`${key} 为内置属性，不能设置。`);
    }
    config[key] = { ...value.common, ...value[env] };
  }

  config.env = env;
  config.mode = mode;

  return config;
};

/** 把 config json 文件生成 typings 文件 字符串 */
exports.getConfigTypings = function getConfigTypings (config, indent = 1, paths = '') {
  const types = {
    env: `'${envs.join(' \'|\' ')}'`,
    mode: `'development' | 'production'`,
  };

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
