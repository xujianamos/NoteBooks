# Source Map 上传到 Sentry 指南

本文档说明如何将项目的 Source Map 上传到 Sentry，以便在错误分析时看到原始源代码。

## 前置条件

1. **安装依赖**
   ```bash
   npm install --save-dev @sentry/cli
   ```

2. **获取 Sentry 认证令牌**
   - 登录 Sentry 网站
   - 进入 **Settings > Account > API > Auth Tokens**
   - 创建新的令牌，需要以下权限：
     - `project:read`
     - `project:releases`
     - `org:read`

3. **设置环境变量**
   ```bash
   export SENTRY_AUTH_TOKEN=your_auth_token
   export SENTRY_ORG=your_org_name
   export SENTRY_PROJECT=your_project_name
   # 可选：如果使用私有化部署的 Sentry
   export SENTRY_URL=https://your-sentry-server.com
   ```

## 使用方法

### 方法一：手动上传（推荐）

1. **构建项目**
   ```bash
   npm run build
   ```

2. **上传 Source Map**
   ```bash
   npm run upload-sourcemaps
   ```

### 方法二：构建时自动上传

使用集成命令，构建完成后自动上传：

```bash
npm run build:with-sourcemaps
```

## 工作原理

1. **生成 Source Map**
   - Vite 配置已设置为在生产构建时生成 `hidden` 模式的 Source Map
   - `hidden` 模式：生成 Source Map 但不暴露给浏览器，更安全
   - Source Map 文件会生成在 `dist/` 和 `dist-electron/` 目录中

2. **上传到 Sentry**
   - 脚本会读取 `package.json` 中的版本号作为 Release 版本
   - 创建 Sentry Release
   - 上传所有 Source Map 文件
   - 完成 Release（标记为可用的状态）

3. **版本匹配**
   - Sentry 使用版本号来匹配 Source Map
   - 确保 `SentryServer` 初始化时使用的 `release` 与 `package.json` 中的版本号一致

## 配置说明

### Vite 配置

已在 `vite.config.ts` 中配置：

```typescript
build: {
  // 生产环境生成 source map（hidden 模式）
  sourcemap: isProduction ? 'hidden' : false,
}
```

### Electron 配置

已在 `electron/domain/sentryServer.ts` 中配置：

```typescript
this.sentry.init({
  release: config.version || app.getVersion(), // 使用版本号
  // ...
});
```

## 验证上传

上传成功后，可以在 Sentry 中查看：

1. 访问：`https://sentry.io/organizations/{org}/releases/{version}/`
2. 检查 Release 详情页中的 "Artifacts" 部分
3. 应该能看到上传的 Source Map 文件

## 故障排查

### 问题：上传失败，提示认证失败

**解决方案：**
- 检查 `SENTRY_AUTH_TOKEN` 环境变量是否正确设置
- 确认令牌权限包含 `project:releases`

### 问题：找不到 Source Map 文件

**解决方案：**
- 确认已运行构建命令：`npm run build`
- 检查 `dist/` 和 `dist-electron/` 目录是否存在
- 确认 Vite 配置中 `sourcemap` 选项已启用

### 问题：错误堆栈仍然显示压缩后的代码

**解决方案：**
- 确认 Sentry 初始化时使用的 `release` 版本号与上传 Source Map 时的版本号一致
- 检查 Sentry Release 是否已标记为 "Finalized"（已完成）
- 清除浏览器缓存后重新触发错误

### 问题：Source Map 文件过大，上传失败

**解决方案：**
- Source Map 文件通常很大，这是正常的
- 如果上传超时，可以尝试：
  - 增加网络超时时间
  - 分批上传（修改脚本）

## 注意事项

1. **安全性**
   - `.sentryclirc` 文件包含认证令牌，已添加到 `.gitignore`
   - 不要在代码仓库中提交认证令牌

2. **版本号管理**
   - 每次发布新版本时，确保 `package.json` 中的版本号已更新
   - Source Map 必须与错误发生时的版本号匹配

3. **生产环境**
   - 建议只在生产构建时上传 Source Map
   - 开发环境可以不生成 Source Map 以加快构建速度

4. **文件大小**
   - Source Map 文件通常很大（几十到几百 MB）
   - 上传可能需要一些时间，请耐心等待

## 相关文件

- `scripts/upload-sourcemaps.js` - 上传脚本
- `vite.config.ts` - Vite 配置（Source Map 生成）
- `electron/domain/sentryServer.ts` - Sentry 初始化配置
- `.sentryclirc` - Sentry CLI 配置文件（自动生成，已忽略）

## 参考链接

- [Sentry Source Maps 文档](https://docs.sentry.io/platforms/javascript/sourcemaps/)
- [Sentry CLI 文档](https://docs.sentry.io/product/cli/)
- [Vite Source Map 配置](https://vitejs.dev/config/build-options.html#build-sourcemap)
