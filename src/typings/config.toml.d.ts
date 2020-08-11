/**
 * 该配置由 `webpack` 根据 `config.yml` 文件生成，**修改无效**
 */

declare module 'config.toml' {
  const globalConfig: {
    configure: {
      a: number;
    };
    theme: {
      'primary-color': string;
    };
  };
  export default globalConfig;
}
