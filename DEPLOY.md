# Cloudflare Pages 部署指南

## 🚀 部署到 Cloudflare Pages

### 方法一：通过 GitHub 集成（推荐）

1. **准备 GitHub 仓库**
   ```bash
   git add .
   git commit -m "Initial commit for Cloudflare Pages deployment"
   git push origin main
   ```

2. **登录 Cloudflare Dashboard**
   - 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 登录您的账户

3. **创建 Pages 项目**
   - 点击 "Pages" → "Create a project"
   - 选择 "Connect to Git"
   - 选择您的 GitHub 仓库
   - 配置构建设置：
     - **Framework preset**: None
     - **Build command**: 留空
     - **Build output directory**: 留空
     - **Root directory**: 留空

4. **部署设置**
   - 项目名称：`car-log-platform`
   - 生产分支：`main`
   - 点击 "Save and Deploy"

### 方法二：使用 Wrangler CLI

1. **安装 Wrangler CLI**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **部署项目**
   ```bash
   wrangler pages deploy .
   ```

### 方法三：直接上传

1. **构建项目**
   - 确保所有文件都在项目根目录
   - 检查 `index.html` 在根目录

2. **上传到 Cloudflare Pages**
   - 在 Cloudflare Dashboard 中选择 "Direct Upload"
   - 拖拽项目文件夹到上传区域
   - 点击部署

## 📁 项目结构

```
car_log/
├── index.html          # 主页面
├── script.js           # JavaScript 逻辑
├── config.js           # 配置文件
├── README.md           # 项目说明
├── LICENSE             # 许可证
├── wrangler.toml       # Cloudflare 配置
└── .gitignore          # Git 忽略文件
```

## ⚙️ 配置说明

### wrangler.toml
- `name`: 项目名称
- `compatibility_date`: 兼容性日期
- `[site]`: 静态站点配置
- `bucket`: 静态文件目录

## 🌐 访问地址

部署成功后，您的网站将通过以下地址访问：
- **生产环境**: `https://car-log-platform.pages.dev`
- **预览环境**: `https://car-log-platform-{hash}.pages.dev`

## 🔧 自定义域名

1. 在 Cloudflare Dashboard 中
2. 选择您的 Pages 项目
3. 点击 "Custom domains"
4. 添加您的域名
5. 配置 DNS 记录

## 📊 性能优化

Cloudflare Pages 自动提供：
- 全球 CDN 加速
- 自动 HTTPS
- 边缘缓存
- 图片优化
- 压缩传输

## 🚨 注意事项

1. **文件大小限制**: 单个文件不能超过 25MB
2. **构建时间**: 免费计划每月 500 次部署
3. **带宽**: 免费计划无限制
4. **存储**: 免费计划无限制

## 🆘 故障排除

### 常见问题

1. **部署失败**
   - 检查文件大小
   - 验证文件路径
   - 查看构建日志

2. **页面无法访问**
   - 检查域名配置
   - 验证 DNS 设置
   - 查看 Pages 状态

3. **功能异常**
   - 检查浏览器控制台
   - 验证 JavaScript 代码
   - 测试本地环境

## 📞 支持

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare 社区](https://community.cloudflare.com/)
- [GitHub Issues](https://github.com/your-repo/issues)
