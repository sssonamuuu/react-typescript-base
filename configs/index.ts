import { GlobalConfigProps } from 'typings/config';

const configs: { [key: string]: GlobalConfigProps } = {};

const req = require.context('./', false, /(?<!(common|index))\.ts$/);

req.keys().forEach(key => {
  const config = req(key);
  configs[key.replace(/^\.\/(\w+)\.ts/, '$1')] = config.__esModule ? config.default : config;
});

const globalConfig = configs[__ENV__];

export default globalConfig;
