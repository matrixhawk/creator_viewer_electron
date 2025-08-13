## 使用方法

> **首先拉取 submodule** ***render*** 
```shell
git submodule init
git submodule update
```


> 安装项目依赖（国内安装electron容易失败,如果失败可以找到.npmrc文件 添加 electron_mirror=https://npmmirror.com/mirrors/electron/ 到此文件指定Electron的镜像地址）
```shell
npm install
```

> 开发运行
```shell
npm run dev
```

> 打包Electron程序
```shell
npm run package
```

