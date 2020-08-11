# 启动命令

1. 本地开发

```
npm start -- --env {env} # env 为启动环境，可选：local/dev/pro
```

`env` 为启动环境，对应 `toml.config` 中不同的环境配置，可以不带直接使用 `npm start` 启动 `local`，

2. 测试/生产编译

```
npm run build -- --env {env} # env 为启动环境，可选：dev/pro
```

# 包兼容问题

1. css-loader@1.x 之后的版本存在找不到 css-loader/locals
2. file-loader@2.x 之后的版本存在引入的资源为 esModule