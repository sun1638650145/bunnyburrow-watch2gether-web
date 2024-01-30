# WebSockets

当使用`WebSocket`技术时, 它包括服务器和客户端两个部分. 服务器部分的详细实现, 请参阅相关[文档](https://github.com/sun1638650145/bunnyburrow-watch2gether-backend/blob/master/docs/websockets.md). 由于我们采用了<b>透明传输</b>的设计理念, 客户端只需要维护好其内部数据格式即可.

因此, 下文重点介绍客户端内部数据的格式.

## 数据格式

客户端有`3`种数据格式: `chat`, `connect`和`player`, 通过`action`属性进行区分.

以下是一个数据包示例.

```javascript
data: {
    // 操作类型: 管理WebSocket连接状态.
    action: 'connect'
    // 其他属性字段: 根据具体操作类型, 提供相关的数据.
}
```

请注意, 不同操作类型可能有特性的属性字段来支持相应的功能.

### chat

`chat`操作用于处理聊天消息.

```javascript
data: {
    action: 'chat'
    // 聊天消息字段.
    message: 'Hello, World!'
    // 用户信息字段.
    user: {
        clientID: 2023 // 只发送客户端ID以减小网络开销.
    }
}
```

### connect

`connect`操作用于管理`WebSocket`连接状态, 包括登录, 确认(回应)和登出.

#### 登录

用户A登录时需要广播自己的用户信息.

```javascript
data: {
    action: 'connect'
    // 状态字段.
    status: 'login'      // 登录.
    // 用户信息字段.
    user: {
        avatar: 'base64' // 头像的Base64编码字符串.
        clientID: 2023   // 客户端ID.
        name: 'A'        // 昵称.
    }
}
```

#### 确认(回应)

用户B收到用户A的用户信息后, 需要单播自己的用户信息确认并回应.

```javascript
data: {
    action: 'connect'
    status: 'ack' // 确认(回应).
    user: {
        avatar: 'base64'
        clientID: 2024
        name: 'B'
    }
}
```

#### 登出

用户A登出前需要广播自己的用户信息.

```javascript
data: {
    action: 'connect'  
    status: 'logout' // 登出.  
    user: {
        clientID: 2023 // 只发送客户端ID以减小网络开销.
    }
}
```

### player

`player`操作用于同步视频播放状态, 包括控制视频的播放/暂停, 修改播放进度和调整播放速率.

#### 播放

用户A广播播放视频.

```javascript
data: {
    action: 'player'
    // 命令字段.
    command: 'play' // 播放.
    // 用户信息字段.
    user: {
        clientID: 2023 // 只发送客户端ID以减小网络开销.
    }
}
```

#### 暂停

用户A广播暂停视频.

```javascript
data: {
    action: 'player'
    command: 'pause' // 暂停.
    user: {
        clientID: 2023
    }
}
```

#### 修改播放进度

用户A广播修改播放进度.

```javascript
data: {
    action: 'player'
    command: {
        newProgress: 117.2024 // 新的播放进度时间(单位为秒).
    }
    user: {
        clientID: 2023
    }
}
```

#### 调整播放速率

用户A广播调整播放速率.

```javascript
data: {
    action: 'player'
    command: {
        playbackRate: 1.5 // 新的播放速率(可选值: 0.5, 0.75, 1, 1.25, 1.5, 2).
    }
    user: {
        clientID: 2023
    }
}
```
