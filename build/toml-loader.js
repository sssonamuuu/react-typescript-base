const fs = require('fs');
const os = require('os');

const toml = require('toml');

const { SRC_ROOT_DIR } = require('./config');
const { mergeConfig, getConfigTypings } = require('./tools');

module.exports = function (str) {
  const config = mergeConfig(toml.parse(str));
  fs.writeFileSync(`${SRC_ROOT_DIR}/config.toml.d.ts`, `/**${os.EOL} * 该配置由 \`webpack\` 根据 \`config.yml\` 文件生成，**修改无效**${os.EOL} */${os.EOL}${os.EOL}declare const globalConfig: ${getConfigTypings(config)};${os.EOL}export default globalConfig;`);
  return `export default ${JSON.stringify(config)}`;
};
