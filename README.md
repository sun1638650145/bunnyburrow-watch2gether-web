# 一起看电影(Web客户端) 🎦

[![build](https://github.com/sun1638650145/bunnyburrow-watch2gether-web/actions/workflows/build.yml/badge.svg)](https://github.com/sun1638650145/bunnyburrow-watch2gether-web/actions/workflows/build.yml) [![release](https://github.com/sun1638650145/bunnyburrow-watch2gether-web/actions/workflows/release.yml/badge.svg)](https://github.com/sun1638650145/bunnyburrow-watch2gether-web/actions/workflows/release.yml) [![codecov](https://codecov.io/gh/sun1638650145/bunnyburrow-watch2gether-web/graph/badge.svg?token=UR2SWN3K5E)](https://codecov.io/gh/sun1638650145/bunnyburrow-watch2gether-web)

一起看电影是[Bunnyburrow Software Project(兔窝镇软件计划)](https://github.com/sun1638650145/bunnyburrow)的第3个组件, 使用它创建流媒体服务, 并与朋友们同步观看影片.

该项目采用了前后端分离的设计模式. 这里提供了一个遵循文档中定义的[WebSockets API](https://github.com/sun1638650145/bunnyburrow-watch2gether-backend/blob/master/docs/websockets.md)的标准Web客户端实现. 您可以直接使用这个Web客户端, 或者以此为基础, 开发更适合您个人需求的客户端.

## 部署并使用 🚀

1. 首先, 在[发布页](https://github.com/sun1638650145/bunnyburrow-watch2gether-web/releases)下载最新的稳定版`zip`文件并解压.

    ```shell
    wget https://github.com/sun1638650145/bunnyburrow-watch2gether-web/releases/download/v0.0.1-beta.1/watch2gether-0.0.1-beta.1.zip
    unzip watch2gether-0.0.1-beta.1.zip
    ```

2. 需要`Node`环境, 安装静态服务器`serve`.

    ```shell
    npm install -g serve
    ```

3. 启动Web客户端.

    ```shell
    serve -s build -l 8080
    ```
