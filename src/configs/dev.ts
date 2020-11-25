import { GlobalConfigProps } from 'typings/config';
import common from './common';

const dev: GlobalConfigProps = {
  ...common,
  testEnv: 'dev',
};

export default dev;
