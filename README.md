# Xhero Website

上海希罗石油化工有限公司官方网站项目。

## 目录结构

- `index.html`：官网首页
- `products/`：产品中心
- `industries/`：应用行业
- `about/`：关于我们
- `contact/`：联系我们
- `assets/`：图片、样式和交互脚本
- `server.mjs`：本地预览服务器
- `vercel.json`：Vercel 部署配置

## 本地预览

```bash
node server.mjs
```

打开 `http://127.0.0.1:4173/` 查看网站。

## 更新说明

日常更新优先修改对应页面目录下的 `index.html`，图片统一放入 `assets/`，全站样式集中维护在 `assets/site.css`。
