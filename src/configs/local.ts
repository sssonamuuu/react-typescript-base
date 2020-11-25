import { GlobalConfigProps } from 'typings/config';
import common from './common';

const local: GlobalConfigProps = {
  ...common,
  testEnv: 'local',
};

export default local;
