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
