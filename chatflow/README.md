# ChatFlow 后端工程

对应《IM后端工程结构设计文档》V1.0 第 38 章「第一阶段推荐工程结构」：**基础层 4 + 接入层 1 + 核心业务层 8，共 13 个模块**。
平台能力层与 `chatflow-job` 暂不建空模块，待功能进入迭代时再创建（避免僵尸模块）。

> 当前按 **Java 17** 构建（本机 JDK 环境）；文档基线为 Java 21，升级只需修改根 `pom.xml` 的 `java.version` / `maven.compiler.release`。

## 模块清单

| 模块 | 层次 | 职责 | 可独立部署 |
| --- | --- | --- | --- |
| `chatflow-bom` | 基础层 | 依赖版本统一（POM） | 否 |
| `chatflow-common` | 基础层 | Result / 异常 / 错误码 / 工具（纯 JDK，无业务语义） | 否 |
| `chatflow-proto` | 基础层 | Protobuf / gRPC 契约（契约先行，单独发布） | 否 |
| `chatflow-infrastructure` | 基础层 | Redis Key 收口 / Kafka Topic 收口 / 中间件封装 | 否 |
| `chatflow-gateway` | 接入层 | 长连接网关 GW + 路由（Netty/WSS） | 是 |
| `chatflow-auth` | 核心业务层 | 登录 / Token / 设备认证 | 是 |
| `chatflow-user` | 核心业务层 | 用户 / 设备 / 组织资料 | 是 |
| `chatflow-relation` | 核心业务层 | 好友 / 好友申请 / 黑名单 | 是 |
| `chatflow-conversation` | 核心业务层 | 会话 / 已读水位 / 未读 | 是 |
| `chatflow-message` | 核心业务层 | 消息收发 / Seq 发号 / 幂等 | 是 |
| `chatflow-sync` | 核心业务层 | SyncKey 增量同步 / 多端一致 | 是 |
| `chatflow-group` | 核心业务层 | 群组 / 成员 / 群权限 | 是 |
| `chatflow-presence` | 核心业务层 | 在线状态（Redis TTL + 批量聚合） | 是 |

## 构建与运行

```bash
# 全量构建
mvn clean install

# 跳过测试
mvn clean install -DskipTests

# 启动消息服务 / 网关
mvn -pl chatflow-message spring-boot:run
mvn -pl chatflow-gateway spring-boot:run
```

## 端口约定（dev）

| 服务 | 端口 | 服务 | 端口 |
| --- | --- | --- | --- |
| gateway | 8000 | sync | 8086 |
| auth | 8081 | group | 8087 |
| user | 8082 | presence | 8088 |
| relation | 8083 | conversation | 8084 |
| message | 8085 | | |

## 关键规约速查

- 业务模块 `pom.xml` 中不允许出现任何 `<version>` 标签（除 `parent`），版本一律由 `chatflow-bom` 管理。
- 全工程版本统一 `${revision}`（根 `pom.xml`），经 flatten-maven-plugin 在 install 时落为字面量。
- Redis 键名统一走 `chatflow-infrastructure` 的 `RedisKeys`，禁止业务代码拼接字面量。
- Kafka Topic 名统一走 `KafkaTopics` 常量；投递 Topic 按网关节点动态分片 `deliver.{gwNodeId}`。
- 依赖方向只允许自上而下：接入层 → 核心业务层 → 基础层；服务间数据交互走 gRPC / Kafka。
