# Sentry 私有化部署文档

## 目录

1. [概述](#概述)
2. [前置要求](#前置要求)
3. [部署架构](#部署架构)
4. [Docker 部署步骤](#docker-部署步骤)
5. [配置说明](#配置说明)
6. [前端应用集成](#前端应用集成)
7. [维护和监控](#维护和监控)
8. [故障排查](#故障排查)
9. [性能优化](#性能优化)
10. [安全加固](#安全加固)

---

## 概述

本文档详细介绍如何使用 Docker 私有化部署 Sentry，用于监控 Electron 桌面应用（中央厨房应用）的错误和性能。

### 为什么选择私有化部署

- **数据完全可控**：所有数据存储在自有服务器，符合数据合规要求
- **无使用限制**：不受免费额度限制，适合大规模使用
- **定制化**：可以根据需求自定义配置和功能
- **成本控制**：长期使用成本可能低于 SaaS 服务

---

## 前置要求

### 服务器要求

#### 最低配置（测试/小规模使用）
- **CPU**: 4 核
- **内存**: 8GB RAM
- **磁盘**: 50GB 可用空间（SSD 推荐）
- **操作系统**: Ubuntu 20.04+ / CentOS 7+ / Debian 10+

#### 推荐配置（生产环境）
- **CPU**: 8 核以上
- **内存**: 16GB RAM 以上
- **磁盘**: 200GB+ 可用空间（SSD 推荐）
- **操作系统**: Ubuntu 22.04 LTS / CentOS 8+
- **网络**: 100Mbps+ 带宽

### 软件要求

- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Git**: 最新版本
- **Python**: 3.8+（用于运行安装脚本）

### 检查系统要求

```bash
# 检查 Docker 版本
docker --version
docker-compose --version

# 检查系统资源
free -h
df -h
nproc

# 检查端口占用（Sentry 需要以下端口）
# 9000 (Web UI)
# 9001 (Worker)
# 5432 (PostgreSQL)
# 6379 (Redis)
# 9009 (Symbolicator)
netstat -tulpn | grep -E '9000|9001|5432|6379|9009'
```

---

## 部署架构

### Sentry 组件说明

Sentry 由以下组件组成：

1. **Web**: Web 服务器，提供 UI 界面
2. **Worker**: 后台任务处理（错误处理、邮件发送等）
3. **Cron**: 定时任务（数据清理、聚合等）
4. **PostgreSQL**: 主数据库
5. **Redis**: 缓存和消息队列
6. **ClickHouse**: 事件存储（可选，用于大数据量）
7. **Symbolicator**: 符号服务器，用于符号化错误堆栈

### 网络架构

```
┌─────────────────────────────────────────┐
│          Internet / 内网用户              │
└──────────────────┬──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │   Nginx (反向代理)    │
         │    Port: 80/443      │
         └──────────┬───────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │   Sentry Web         │
         │   Port: 9000         │
         └──────────┬───────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌──────────────┐       ┌──────────────┐
│   Worker     │       │   Cron       │
│   Port: 9001 │       │              │
└──────┬───────┘       └──────┬───────┘
       │                      │
       └──────────┬───────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌──────────────┐    ┌──────────────┐
│ PostgreSQL   │    │    Redis     │
│  Port: 5432  │    │  Port: 6379  │
└──────────────┘    └──────────────┘
```

---

## Docker 部署步骤

### 步骤 1: 克隆 Sentry 仓库

```bash
# 创建部署目录
mkdir -p /opt/sentry
cd /opt/sentry

# 克隆 Sentry 官方仓库
git clone https://github.com/getsentry/self-hosted.git sentry
cd sentry

# 切换到稳定版本（推荐使用稳定标签）

git checkout 24.1.0  # 使用最新稳定版本
```

### 步骤 2: 安装 Docker 和 Docker Compose

如果服务器还没有安装 Docker：

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证安装
docker --version
docker-compose --version
```

### 步骤 3: 配置环境变量

```bash
# 复制示例配置文件
cp .env.example .env

# 编辑配置文件
vim .env
```

关键配置项说明：

```bash
# 基本配置
SENTRY_SECRET_KEY='生成一个随机字符串，至少32字符'
SENTRY_POSTGRES_HOST=postgres
SENTRY_DB_USER=sentry
SENTRY_DB_PASSWORD='设置强密码'
SENTRY_REDIS_HOST=redis
SENTRY_REDIS_PASSWORD='设置Redis密码（可选）'

# 邮件配置（用于发送告警通知）
SENTRY_MAIL_BACKEND=smtp
SENTRY_MAIL_HOST=smtp.example.com
SENTRY_MAIL_PORT=587
SENTRY_MAIL_USERNAME=your-email@example.com
SENTRY_MAIL_PASSWORD=your-email-password
SENTRY_MAIL_USE_TLS=true
SENTRY_SERVER_EMAIL=your-email@example.com

# 系统配置
SENTRY_SINGLE_ORGANIZATION=true  # 单组织模式
SENTRY_URL_PREFIX=http://your-sentry-domain.com  # 你的域名
SENTRY_ALLOWED_HOSTS=your-sentry-domain.com,*.your-sentry-domain.com

# 性能配置（根据服务器资源调整）
SENTRY_WORKERS=4  # Worker 进程数，建议 CPU 核心数
SENTRY_MAX_WORKERS=8  # 最大 Worker 数

# 数据保留配置
SENTRY_EVENT_RETENTION_DAYS=90  # 事件保留天数
```

生成 Secret Key：

```bash
# 生成随机密钥
openssl rand -base64 32
# 将生成的字符串填入 SENTRY_SECRET_KEY
```

### 步骤 4: 构建和启动服务

```bash
# 构建 Docker 镜像
docker-compose build

# 运行数据库迁移（首次部署）
docker-compose run --rm web upgrade

# 创建超级用户（首次部署）
docker-compose run --rm web createuser \
  --email admin@example.com \
  --password your-password \
  --superuser \
  --no-input

# 启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

### 步骤 5: 验证部署

```bash
# 检查服务健康状态
curl http://localhost:9000/api/0/

# 访问 Web UI
# 浏览器打开: http://your-server-ip:9000
# 使用创建的超管账号登录
```

### 步骤 6: 配置 Nginx 反向代理（可选但推荐）

为了更好的性能和安全性，建议使用 Nginx 作为反向代理：

```bash
# 安装 Nginx
sudo apt-get update
sudo apt-get install nginx

# 创建 Nginx 配置
sudo vim /etc/nginx/sites-available/sentry
```

Nginx 配置示例：

```nginx
upstream sentry {
    server 127.0.0.1:9000;
}

server {
    listen 80;
    server_name sentry.example.com;  # 替换为你的域名

    # 重定向到 HTTPS（如果使用 SSL）
    # return 301 https://$server_name$request_uri;

    # 如果暂时不使用 HTTPS，直接使用以下配置
    location / {
        proxy_pass http://sentry;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket 支持
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 静态文件缓存
    location /_static/ {
        proxy_pass http://sentry;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# 启用配置
sudo ln -s /etc/nginx/sites-available/sentry /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 步骤 7: 配置 SSL（HTTPS）（推荐）

使用 Let's Encrypt 免费证书：

```bash
# 安装 Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d sentry.example.com

# 自动续期测试
sudo certbot renew --dry-run
```

更新 Nginx 配置以使用 HTTPS：

```nginx
server {
    listen 443 ssl http2;
    server_name sentry.example.com;

    ssl_certificate /etc/letsencrypt/live/sentry.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sentry.example.com/privkey.pem;
    
    # SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://sentry;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

server {
    listen 80;
    server_name sentry.example.com;
    return 301 https://$server_name$request_uri;
}
```

**重要**: 更新 `.env` 文件中的 `SENTRY_URL_PREFIX` 为 HTTPS 地址：

```bash
SENTRY_URL_PREFIX=https://sentry.example.com
```

然后重启服务：

```bash
cd /opt/sentry/sentry
docker-compose restart web
```

---

## 配置说明

### 创建项目和组织

1. 登录 Sentry Web UI
2. 创建组织（如果 `SENTRY_SINGLE_ORGANIZATION=false`）
3. 创建项目：
   - 选择平台：**Electron**
   - 项目名称：`central-kitchen-desk`
   - 团队：选择或创建团队

### 获取 DSN

创建项目后，在项目设置中获取 DSN（Data Source Name），格式如下：

```
http://your-public-key:your-secret-key@sentry.example.com/your-project-id
```

**注意**: 如果使用 HTTPS，DSN 应该是：
```
https://your-public-key:your-secret-key@sentry.example.com/your-project-id
```

### 配置邮件通知

在 Sentry UI 中配置邮件通知：

1. 进入 **Settings** > **Notifications**
2. 配置邮件通知规则
3. 测试邮件发送

### 数据保留策略

在 `.env` 文件中配置：

```bash
# 事件保留天数
SENTRY_EVENT_RETENTION_DAYS=90

# 启用自动清理
SENTRY_ENABLE_CRON=true
```

定期清理命令（Cron 会自动执行，也可以手动执行）：

```bash
docker-compose run --rm web cleanup --days 90
```

---

## 前端应用集成

### 步骤 1: 安装依赖

在项目根目录安装 Sentry Electron SDK：

```bash
npm install @sentry/electron
```

### 步骤 2: 配置 Sentry（主进程）

创建 Sentry 配置文件：

```typescript
// electron/infrastructure/sentry.ts
import * as Sentry from '@sentry/electron';
import { app } from 'electron';
import appConfig from '../config';

export function initSentry() {
  const config = appConfig.getConfig();
  
  // 根据环境配置 Sentry
  const sentryConfig = config.sentry;
  
  if (!sentryConfig?.enabled || !sentryConfig?.dsn) {
    console.log('Sentry is disabled or DSN not configured');
    return;
  }

  Sentry.init({
    dsn: sentryConfig.dsn,
    environment: config.environment || 'production',
    release: app.getVersion(),
    
    // 采样率（0.0 - 1.0）
    tracesSampleRate: sentryConfig.tracesSampleRate || 0.1,
    
    // 忽略的错误
    ignoreErrors: [
      'Network request failed',
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
    ],
    
    // 上报前处理
    beforeSend(event, hint) {
      // 移除敏感信息
      if (event.request) {
        delete event.request.cookies;
        if (event.request.headers) {
          delete event.request.headers.Authorization;
        }
      }
      
      // 检查事件大小（Sentry 限制约 200KB）
      const eventSize = JSON.stringify(event).length;
      if (eventSize > 180000) {
        console.warn('Event too large, truncating extra data');
        if (event.extra) {
          Object.keys(event.extra).forEach(key => {
            const value = event.extra[key];
            if (typeof value === 'string' && value.length > 1000) {
              event.extra[key] = value.substring(0, 1000) + '... [truncated]';
            }
          });
        }
      }
      
      return event;
    },
  });

  console.log('Sentry initialized successfully');
}
```

### 步骤 3: 在应用启动时初始化

在 `electron/main.ts` 中初始化：

```typescript
// electron/main.ts
import { initSentry } from './infrastructure/sentry';

// 在应用启动早期初始化 Sentry
app.whenReady().then(() => {
  initSentry();
  // ... 其他初始化代码
});
```

### 步骤 4: 修改 Logger 集成 Sentry

更新 `electron/infrastructure/logger/index.ts`：

```typescript
import * as Sentry from '@sentry/electron';
import userService from '../domain/userService';

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
          taskId: context?.taskId || 'unknown',
        },
        extra: {
          message,
          taskData: context?.taskData ? this.compressTaskData(context.taskData) : undefined,
          resources: context?.resources?.map(r => ({
            id: r.id,
            type: r.type,
            url: r.url,
          })),
        },
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

  // 压缩任务数据，避免超出大小限制
  private compressTaskData(taskData: any): any {
    return {
      id: taskData.id,
      status: taskData.status,
      qaID: taskData.qaID,
      method: taskData.method,
      scope: taskData.scope,
      createdAt: taskData.createdAt,
      updatedAt: taskData.updatedAt,
      subtasks: taskData.subtasks?.map((st: any) => ({
        id: st.id,
        category: st.category,
        status: st.status,
      })),
      resources: taskData.resources?.map((r: any) => ({
        id: r.id,
        type: r.type,
        resourceType: r.resourceType,
      })),
    };
  }
}
```

### 步骤 5: 添加环境配置

在各个环境配置文件中添加 Sentry 配置：

```typescript
// electron/config/dev.ts
export default {
  baseUrl: "https://central-kitchen-api-dev.pinguo.cn",
  dataEnv: 'dev',
  sentry: {
    enabled: true,
    dsn: 'https://your-public-key:your-secret-key@sentry.example.com/your-project-id',
    tracesSampleRate: 1.0, // 开发环境 100% 采样
  },
};

// electron/config/prod.ts
export default {
  baseUrl: "https://central-kitchen-api-prod.pinguo.cn",
  dataEnv: 'prod',
  sentry: {
    enabled: true,
    dsn: 'https://your-public-key:your-secret-key@sentry.example.com/your-project-id',
    tracesSampleRate: 0.1, // 生产环境 10% 采样
  },
};
```

### 步骤 6: 设置用户上下文

在用户登录后设置用户信息：

```typescript
// electron/application/user.ts 或相关文件
import * as Sentry from '@sentry/electron';
import userService from '../domain/userService';

export async function setSentryUser() {
  try {
    const userInfo = await userService.getUserInfo();
    if (userInfo) {
      Sentry.setUser({
        id: userInfo.userID,
        username: userInfo.username,
        // 注意：不要包含敏感信息
      });
    }
  } catch (error) {
    console.error('Failed to set Sentry user context:', error);
  }
}
```

### 步骤 7: 测试集成

```typescript
// 在应用某个地方测试 Sentry
import * as Sentry from '@sentry/electron';

// 测试错误上报
Sentry.captureException(new Error('Test error from Electron app'));

// 测试消息上报
Sentry.captureMessage('Test message', 'info');
```

---

## 维护和监控

### 日常维护命令

```bash
cd /opt/sentry/sentry

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f web      # Web 服务日志
docker-compose logs -f worker    # Worker 日志
docker-compose logs -f cron     # Cron 日志

# 重启服务
docker-compose restart web
docker-compose restart worker

# 更新 Sentry
git pull
docker-compose build
docker-compose run --rm web upgrade
docker-compose up -d

# 备份数据库
docker-compose exec postgres pg_dump -U sentry sentry > backup_$(date +%Y%m%d).sql

# 恢复数据库
docker-compose exec -T postgres psql -U sentry sentry < backup_20250101.sql
```

### 监控脚本

创建监控脚本检查服务健康状态：

```bash
#!/bin/bash
# /opt/sentry/health-check.sh

SENTRY_URL="http://localhost:9000"
API_URL="$SENTRY_URL/api/0/"

# 检查 API 是否响应
response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL")

if [ "$response" != "200" ]; then
    echo "Sentry is not responding! HTTP Status: $response"
    # 可以发送告警通知
    exit 1
fi

echo "Sentry is healthy"
exit 0
```

添加到 Crontab：

```bash
# 每5分钟检查一次
*/5 * * * * /opt/sentry/health-check.sh
```

### 备份策略

创建备份脚本：

```bash
#!/bin/bash
# /opt/sentry/backup.sh

BACKUP_DIR="/opt/sentry/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p "$BACKUP_DIR"

# 备份数据库
docker-compose exec -T postgres pg_dump -U sentry sentry | gzip > "$BACKUP_DIR/db_$DATE.sql.gz"

# 备份配置文件
tar -czf "$BACKUP_DIR/config_$DATE.tar.gz" .env docker-compose.yml

# 删除30天前的备份
find "$BACKUP_DIR" -type f -mtime +30 -delete

echo "Backup completed: $DATE"
```

添加到 Crontab（每天凌晨2点备份）：

```bash
0 2 * * * /opt/sentry/backup.sh
```

---

## 故障排查

### 常见问题

#### 1. 服务无法启动

```bash
# 检查端口占用
netstat -tulpn | grep -E '9000|5432|6379'

# 检查 Docker 日志
docker-compose logs

# 检查磁盘空间
df -h

# 检查内存
free -h
```

#### 2. 数据库连接失败

```bash
# 检查 PostgreSQL 状态
docker-compose ps postgres

# 查看 PostgreSQL 日志
docker-compose logs postgres

# 测试数据库连接
docker-compose exec postgres psql -U sentry -d sentry -c "SELECT 1;"
```

#### 3. Redis 连接失败

```bash
# 检查 Redis 状态
docker-compose ps redis

# 测试 Redis 连接
docker-compose exec redis redis-cli ping
```

#### 4. Worker 任务不执行

```bash
# 检查 Worker 日志
docker-compose logs worker

# 重启 Worker
docker-compose restart worker

# 检查队列状态
docker-compose exec web sentry shell
# 在 Python shell 中：
# from sentry.celery import app
# app.control.inspect().active()
```

#### 5. 前端无法上报错误

检查清单：

1. **DSN 配置是否正确**
   ```typescript
   // 检查 DSN 格式
   console.log(sentryConfig.dsn);
   ```

2. **网络连接**
   ```bash
   # 从客户端测试连接
   curl -X POST https://sentry.example.com/api/your-project-id/store/ \
     -H "Content-Type: application/json" \
     -d '{"message": "test"}'
   ```

3. **CORS 配置**（如果从浏览器访问）
   - Sentry 默认允许跨域，但需要检查 Nginx 配置

4. **查看 Sentry 日志**
   ```bash
   docker-compose logs -f web | grep "POST /api"
   ```

#### 6. 性能问题

```bash
# 检查资源使用
docker stats

# 优化 Worker 数量
# 在 .env 中调整
SENTRY_WORKERS=4  # 根据 CPU 核心数调整

# 检查数据库性能
docker-compose exec postgres psql -U sentry -d sentry -c "
SELECT * FROM pg_stat_activity WHERE datname = 'sentry';
"
```

### 日志查看

```bash
# 实时查看所有日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f web
docker-compose logs -f worker
docker-compose logs -f cron

# 查看最近100行日志
docker-compose logs --tail=100 web

# 查看特定时间段的日志
docker-compose logs --since 2025-01-01T00:00:00 web
```

---

## 性能优化

### 1. 数据库优化

```bash
# 在 .env 中添加 PostgreSQL 配置
POSTGRES_DB=sentry
POSTGRES_USER=sentry
POSTGRES_PASSWORD=your-password
POSTGRES_INITDB_ARGS="-E utf8"
```

优化 PostgreSQL 配置（`docker-compose.override.yml`）：

```yaml
services:
  postgres:
    command: >
      postgres
      -c shared_buffers=256MB
      -c effective_cache_size=1GB
      -c maintenance_work_mem=64MB
      -c checkpoint_completion_target=0.9
      -c wal_buffers=16MB
      -c default_statistics_target=100
      -c random_page_cost=1.1
      -c effective_io_concurrency=200
      -c work_mem=4MB
      -c min_wal_size=1GB
      -c max_wal_size=4GB
```

### 2. Redis 优化

```bash
# 在 .env 中配置
REDIS_MAXMEMORY=2gb
REDIS_MAXMEMORY_POLICY=allkeys-lru
```

### 3. Worker 优化

```bash
# 根据服务器资源调整 Worker 数量
SENTRY_WORKERS=4  # 建议为 CPU 核心数
SENTRY_MAX_WORKERS=8
```

### 4. 启用 ClickHouse（大数据量场景）

对于大规模使用，建议启用 ClickHouse 存储事件：

```bash
# 在 docker-compose.yml 中添加 ClickHouse 服务
# 参考 Sentry 官方文档配置
```

### 5. 数据清理

定期清理旧数据：

```bash
# 在 .env 中配置保留天数
SENTRY_EVENT_RETENTION_DAYS=90

# 手动清理
docker-compose run --rm web cleanup --days 90
```

---

## 安全加固

### 1. 防火墙配置

```bash
# 只允许必要的端口
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### 2. 定期更新

```bash
# 定期更新 Sentry
cd /opt/sentry/sentry
git pull
docker-compose build
docker-compose run --rm web upgrade
docker-compose up -d

# 更新系统
sudo apt-get update && sudo apt-get upgrade
```

### 3. 数据库安全

```bash
# 使用强密码
# 定期备份
# 限制数据库访问（只允许本地连接）
```

### 4. SSL/TLS 配置

确保使用 HTTPS，并配置强加密：

```nginx
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
ssl_prefer_server_ciphers on;
```

### 5. 访问控制

- 使用强密码策略
- 启用双因素认证（2FA）
- 定期审查用户权限
- 限制 API 访问

---

## 快速参考

### 常用命令

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 重启服务
docker-compose restart

# 查看状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 更新服务
git pull && docker-compose build && docker-compose up -d

# 备份数据库
docker-compose exec postgres pg_dump -U sentry sentry > backup.sql

# 恢复数据库
docker-compose exec -T postgres psql -U sentry sentry < backup.sql

# 清理旧数据
docker-compose run --rm web cleanup --days 90
```

### 重要文件位置

- 配置文件: `/opt/sentry/sentry/.env`
- Docker Compose: `/opt/sentry/sentry/docker-compose.yml`
- 日志目录: `/opt/sentry/sentry/`（通过 `docker-compose logs` 查看）
- 数据目录: Docker volumes（`docker volume ls` 查看）

### 获取帮助

- [Sentry 官方文档](https://develop.sentry.dev/self-hosted/)
- [Sentry GitHub](https://github.com/getsentry/self-hosted)
- [Sentry 社区论坛](https://forum.sentry.io/)

---

## 附录

### A. 完整的环境变量示例

```bash
# 基本配置
SENTRY_SECRET_KEY='your-secret-key-here'
SENTRY_POSTGRES_HOST=postgres
SENTRY_DB_USER=sentry
SENTRY_DB_PASSWORD='your-db-password'
SENTRY_REDIS_HOST=redis
SENTRY_REDIS_PASSWORD='your-redis-password'

# 系统配置
SENTRY_SINGLE_ORGANIZATION=true
SENTRY_URL_PREFIX=https://sentry.example.com
SENTRY_ALLOWED_HOSTS=sentry.example.com,*.sentry.example.com

# 邮件配置
SENTRY_MAIL_BACKEND=smtp
SENTRY_MAIL_HOST=smtp.example.com
SENTRY_MAIL_PORT=587
SENTRY_MAIL_USERNAME=your-email@example.com
SENTRY_MAIL_PASSWORD=your-email-password
SENTRY_MAIL_USE_TLS=true
SENTRY_SERVER_EMAIL=your-email@example.com

# 性能配置
SENTRY_WORKERS=4
SENTRY_MAX_WORKERS=8

# 数据保留
SENTRY_EVENT_RETENTION_DAYS=90
SENTRY_ENABLE_CRON=true
```

### B. Docker Compose 服务说明

- `web`: Web 服务器
- `worker`: 后台任务处理
- `cron`: 定时任务
- `postgres`: PostgreSQL 数据库
- `redis`: Redis 缓存
- `smtp`: 邮件服务器（可选）

### C. 故障排查检查清单

- [ ] 检查 Docker 服务状态
- [ ] 检查端口占用
- [ ] 检查磁盘空间
- [ ] 检查内存使用
- [ ] 检查网络连接
- [ ] 检查日志文件
- [ ] 检查配置文件
- [ ] 检查数据库连接
- [ ] 检查 Redis 连接
- [ ] 检查 DSN 配置

---

*文档最后更新: 2025-01-01*
*Sentry 版本: 24.1.0*

