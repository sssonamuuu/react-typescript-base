import { CommonConfigProps } from 'typings/config';

const common: CommonConfigProps = {
  testCommon: 'test',
  /**
   * 以下配置如果是 antd 变量，会修改antd主题
   * 如果不是，则仅为自定义变量
   * 两种变量都可以在 less 中 通过 @variable-name 使用
   * 同样，也可以在tsx?中通过 globalConfig.theme[variable-name] 使用
   * @see https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
   */
  theme: {
    /** 根节点ID */
    rootId: 'app',
    /** 暂时不要更改，ant部分组件存在不生效问题 */
    'ant-prefix': 'ant',
    'primary-color': '#0170fe',
    'label-color': '#6E7F9C',
  },
};

export default common;
