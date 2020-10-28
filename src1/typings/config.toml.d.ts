/**
 * 该配置由 `webpack` 根据 `config.yml` 文件生成，**修改无效**
 */

declare module 'config.toml' {
  const globalConfig: {
    configure: {
      requestUrl: string;
      a: number;
    };
    theme: {
      rootId: string;
      'ant-prefix': string;
      'primary-color': string;
      'label-color': string;
    };
    env: string;
    mode: string;
  };
  export default globalConfig;
}
