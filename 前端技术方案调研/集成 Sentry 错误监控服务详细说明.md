# 方案一：集成 Sentry 错误监控服务详细说明

## 概述

Sentry 是一个开源的错误监控和性能监控平台，提供完善的错误追踪、聚合、分析功能。对于 Electron 应用，Sentry 提供了专门的 SDK 支持。

## 为什么选择 Sentry

1. **开箱即用**：提供完整的错误监控解决方案，无需从零开发
2. **强大的错误聚合**：自动将相似的错误分组，便于分析
3. **丰富的上下文信息**：自动收集用户环境、设备信息、错误堆栈等
4. **实时告警**：支持邮件、Slack 等通知方式
5. **完善的界面**：提供直观的错误分析和管理界面
6. **Electron 支持**：官方提供 `@sentry/electron` SDK，专门优化 Electron 应用

## 需要收集的信息

在集成 Sentry 时，需要确保收集以下信息：

### 1. 日志信息
- 错误发生时的日志上下文
- 错误前后的日志片段（通过 Breadcrumbs 实现）

### 2. 用户信息
```typescript
Sentry.setUser({
  id: userInfo.userID,
  username: userInfo.username,
  // 注意：不要包含敏感信息
});
```

### 3. 错误相关的图片资源
- 在错误上下文中附加资源信息
- 可以通过 Sentry 的附加数据（extra data）功能添加

### 4. 任务JSON数据
- 如果错误与任务相关，将任务数据作为附加信息
- 注意大小限制，Sentry 对单个事件有大小限制（通常 200KB）

### 5. 环境信息（自动收集）
- 操作系统版本
- 应用版本
- 设备信息
- Node.js 版本
- Electron 版本

## 实施步骤

### 步骤 1：安装依赖

```bash
npm install @sentry/electron
```

### 步骤 2：初始化 Sentry

在主进程（`electron/main.ts`）中初始化：

```typescript
import * as Sentry from '@sentry/electron';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN', // 从 Sentry 项目设置中获取
  environment: process.env.NODE_ENV || 'production',
  // 设置采样率（0.0 - 1.0），避免上报过多日志
  tracesSampleRate: 0.1,
  // 设置错误上报前处理
  beforeSend(event, hint) {
    // 过滤敏感信息
    // 检查事件大小
    return event;
  },
});
```

### 步骤 3：修改 Logger 类

在 `electron/infrastructure/logger/index.ts` 中集成 Sentry：

```typescript
import * as Sentry from '@sentry/electron';

class Logger {
  // ... 现有代码 ...

  public error(message: string, error?: Error | any, context?: {
    taskId?: string;
    taskData?: any;
    resources?: any[];
    userInfo?: any;
  }): void {
    // 本地日志记录（保持不变）
    this.logger.error(message, { error: error?.stack || error });
    
    // 上报到 Sentry
    if (error instanceof Error) {
      Sentry.captureException(error, {
        level: 'error',
        tags: {
          component: 'logger',
          // 如果有任务ID，添加到标签
          taskId: context?.taskId || 'unknown',
        },
        extra: {
          message,
          // 任务数据（注意大小限制）
          taskData: context?.taskData ? JSON.stringify(context.taskData).substring(0, 50000) : undefined,
          // 资源信息（只保存基本信息，不保存完整文件）
          resources: context?.resources?.map(r => ({
            id: r.id,
            type: r.type,
            url: r.url,
            // 不包含完整文件内容
          })),
        },
        // 添加用户信息
        user: context?.userInfo ? {
          id: context.userInfo.userID,
          username: context.userInfo.username,
        } : undefined,
      });
    } else {
      Sentry.captureMessage(message, {
        level: 'error',
        extra: {
          error: error,
          ...context,
        },
      });
    }
  }
}
```

### 步骤 4：添加 Breadcrumbs（日志痕迹）

Breadcrumbs 可以记录错误发生前的操作序列，帮助定位问题：

```typescript
// 在关键操作处添加 Breadcrumb
Sentry.addBreadcrumb({
  category: 'task',
  message: 'Task operation started',
  level: 'info',
  data: {
    taskId: 'task123',
    operation: 'download',
  },
});
```

可以在 Logger 的 info/warn/debug 方法中添加：

```typescript
public info(message: string, meta?: any): void {
  this.logger.info(message, meta);
  
  // 添加到 Sentry Breadcrumbs（不直接上报，作为上下文）
  Sentry.addBreadcrumb({
    message,
    level: 'info',
    data: meta,
  });
}
```

### 步骤 5：设置用户上下文

在应用启动或用户登录后设置用户信息：

```typescript
import userService from './domain/userService';

async function setUserContext() {
  const userInfo = await userService.getUserInfo();
  if (userInfo) {
    Sentry.setUser({
      id: userInfo.userID,
      username: userInfo.username,
      // 不要包含敏感信息如密码、邮箱等
    });
  }
}
```

### 步骤 6：收集任务和资源信息

在错误发生时，如果有相关的任务上下文，收集并附加：

```typescript
import TaskStorage from './infrastructure/storage/taskStorage';

async function captureTaskError(
  error: Error,
  taskId: string,
  message: string
) {
  try {
    // 获取任务数据
    const taskStorage = TaskStorage.getInstance(taskId);
    const taskData = taskStorage.getTask(taskId);
    
    // 获取用户信息
    const userInfo = await userService.getUserInfo();
    
    // 收集资源信息（只保存基本信息）
    const resources = taskData?.resources?.map((r: any) => ({
      id: r.id,
      type: r.type,
      url: r.url,
      fileName: r.fileName,
    })) || [];
    
    // 上报错误
    logger.error(message, error, {
      taskId,
      taskData: {
        id: taskData?.id,
        status: taskData?.status,
        // 只保存关键字段，避免超出大小限制
        subtasks: taskData?.subtasks?.map((st: any) => ({
          id: st.id,
          category: st.category,
        })),
      },
      resources,
      userInfo,
    });
  } catch (err) {
    // 如果收集信息失败，至少上报原始错误
    logger.error('Failed to collect task context', err);
    logger.error(message, error);
  }
}
```

### 步骤 7：处理大文件和资源

由于 Sentry 对单个事件有大小限制（通常 200KB），对于图片资源，建议：

1. **不直接上传图片文件**：只上传图片的元数据（ID、URL、路径等）
2. **使用附件功能**：如果必须上传图片，使用 Sentry 的附件功能（需要付费计划）
3. **压缩任务数据**：只保存任务的关键字段，不保存完整嵌套数据

```typescript
// 压缩任务数据，只保留关键信息
function compressTaskData(taskData: any): any {
  return {
    id: taskData.id,
    status: taskData.status,
    qaID: taskData.qaID,
    method: taskData.method,
    scope: taskData.scope,
    createdAt: taskData.createdAt,
    updatedAt: taskData.updatedAt,
    // 子任务只保留基本信息
    subtasks: taskData.subtasks?.map((st: any) => ({
      id: st.id,
      category: st.category,
      status: st.status,
    })),
    // 资源只保留ID和类型
    resources: taskData.resources?.map((r: any) => ({
      id: r.id,
      type: r.type,
      resourceType: r.resourceType,
    })),
    // 不包含完整的 editingConfiguration 等大数据字段
  };
}
```

## 配置选项说明

### 环境配置

```typescript
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV, // dev, qa, prod
  // 根据环境设置不同的采样率
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
});
```

### 过滤和过滤规则

```typescript
Sentry.init({
  // 忽略某些错误
  ignoreErrors: [
    'Network request failed',
    'ResizeObserver loop limit exceeded',
  ],
  // 过滤某些URL
  denyUrls: [
    /extensions\//i,
    /^chrome:\/\//i,
  ],
  // 上报前处理
  beforeSend(event, hint) {
    // 移除敏感信息
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers?.Authorization;
    }
    
    // 检查事件大小
    const eventSize = JSON.stringify(event).length;
    if (eventSize > 180000) { // 180KB，留一些余量
      console.warn('Event too large, truncating extra data');
      // 移除或截断 extra 数据
      if (event.extra) {
        event.extra = Object.fromEntries(
          Object.entries(event.extra).map(([key, value]) => [
            key,
            typeof value === 'string' && value.length > 1000
              ? value.substring(0, 1000) + '... [truncated]'
              : value,
          ])
        );
      }
    }
    
    return event;
  },
});
```

### 性能监控

```typescript
Sentry.init({
  // 启用性能监控
  tracesSampleRate: 0.1, // 10% 的请求会被追踪
  // 或使用 tracesSampler 进行更精细的控制
  tracesSampler: (samplingContext) => {
    // 重要操作 100% 采样
    if (samplingContext.transactionContext?.name?.includes('critical')) {
      return 1.0;
    }
    // 其他操作 10% 采样
    return 0.1;
  },
});
```

## 本地开发配置

在开发环境中，可以禁用 Sentry 或使用测试 DSN：

```typescript
// electron/config/dev.ts
export default {
  sentry: {
    enabled: false, // 开发环境禁用
    dsn: '', // 或使用测试 DSN
  },
};

// electron/main.ts
import appConfig from './config';

if (appConfig.getConfig().sentry?.enabled) {
  Sentry.init({
    dsn: appConfig.getConfig().sentry.dsn,
    // ...
  });
}
```

## 成本考虑

### Sentry 免费版限制
- 5,000 错误事件/月
- 10,000 性能事务/月
- 1 GB 附件存储

### 超出限制的处理
1. **采样上报**：只上报部分错误（如 10%）
2. **过滤无关错误**：通过 `ignoreErrors` 过滤
3. **错误聚合**：利用 Sentry 的自动聚合功能
4. **升级付费计划**：如果错误量较大，考虑升级

## 最佳实践

### 1. 错误分类和标签

使用标签对错误进行分类，便于过滤和查询：

```typescript
Sentry.captureException(error, {
  tags: {
    component: 'task-manager',
    operation: 'download',
    taskType: 'qa',
    severity: 'high',
  },
});
```

### 2. 上下文信息

在关键操作前后设置上下文：

```typescript
Sentry.configureScope((scope) => {
  scope.setContext('task', {
    taskId: 'task123',
    status: 'processing',
    subtaskCount: 5,
  });
  
  scope.setContext('resource', {
    resourceId: 'res123',
    type: 'image',
    size: 1024000,
  });
});
```

### 3. 用户反馈

集成用户反馈功能，让用户描述错误情况：

```typescript
// 在错误页面显示反馈按钮
Sentry.showReportDialog({
  eventId: lastEventId,
  user: {
    email: userInfo.email, // 可选
    name: userInfo.username,
  },
});
```

### 4. 版本发布跟踪

在 Sentry 中关联代码版本，便于定位问题版本：

```typescript
Sentry.init({
  release: app.getVersion(), // 或从 package.json 获取
});
```

## 与现有系统集成

### 与 EventTracker 集成

可以在 EventTracker 中同时上报到 Sentry：

```typescript
// electron/application/eventTracker.ts
import * as Sentry from '@sentry/electron';

export class EventTracker {
  trackError(error: Error, context?: any) {
    // 上报到现有追踪系统
    this.add({
      eventId: EEventID.ERROR,
      action: 'error',
      error: error.message,
      ...context,
    });
    
    // 同时上报到 Sentry
    Sentry.captureException(error, {
      extra: context,
    });
  }
}
```

## 监控和告警

### 设置告警规则

在 Sentry 后台设置：
- 新错误出现时通知
- 错误频率超过阈值时通知
- 特定标签的错误通知

### 集成通知渠道

- 邮件通知
- Slack 集成
- 钉钉/企业微信 Webhook
- PagerDuty 集成

## 总结

集成 Sentry 是一个快速、有效的错误监控方案。通过合理配置，可以：
- 实时监控应用错误
- 自动收集丰富的上下文信息
- 快速定位和解决问题
- 提供完善的错误分析界面

**实施优先级：高**
**开发工作量：低（1-2 天）**
**维护成本：低**

