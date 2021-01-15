# 启动命令

1. 本地开发

```
npm start -- --env {env} # env 为启动环境，可选：local/dev/pro等 configs 下的文件名
```

`env` 为启动环境，对应 `configs` 下不同的环境配置文件配置，可以不带直接使用 `npm start` 启动 `local`，

2. 测试/生产编译

```
npm run build -- --env {env} # env 为启动环境，可选：dev/pro等 configs 下的文件名
```
