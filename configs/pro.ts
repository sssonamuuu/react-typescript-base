import { GlobalConfigProps } from 'typings/config';
import common from './common';

const pro: GlobalConfigProps = {
  ...common,
  testEnv: 'pro',
};

export default pro;
