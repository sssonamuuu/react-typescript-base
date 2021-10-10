export interface CommonConfigProps {
  testCommon: string;
  /**
   * 以下配置如果是 antd 变量，会修改antd主题
   * 如果不是，则仅为自定义变量
   * 两种变量都可以在 less 中 通过 @variable-name 使用
   * 同样，也可以在tsx?中通过 globalConfig.theme[variable-name] 使用
   * @see https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less
   */
  theme: {
    /** 根节点ID */
    rootId: string;
    scrollRootClassName: string;
    'ant-prefix': string;
    'primary-color': string;
    'label-color': string;
    'link-color': string;
    'success-color': string;
    'warning-color': string;
    'error-color': string;
    'normal-color': string;
  };
}

export interface EvnConfigProps {
  /** 接口地址 */
  baseUrl: string;
}

export interface GlobalConfigProps extends CommonConfigProps, EvnConfigProps {}
