# 星辰塔罗

给朋友的塔罗礼物站。前端是单页 HTML/CSS/JS；AI 解读和隐藏彩蛋祝福由后端接口 `/api/reading`、`/api/blessing` 提供，API Key 只从环境变量读取。

## 本地预览

只看前端可以直接打开 `index.html`。如需启用 AI 解读，在本目录运行：

```bash
AI_PROVIDER=deepseek DEEPSEEK_API_KEY=你的_key npm start
```

然后访问 `http://127.0.0.1:4173`。

通义千问兼容模式：

```bash
AI_PROVIDER=qwen QWEN_API_KEY=你的_key npm start
```

也可以使用 `DASHSCOPE_API_KEY`。模型名可用 `DEEPSEEK_MODEL`、`QWEN_MODEL` 或通用 `AI_MODEL` 覆盖。

## Vercel 部署

部署目录选择本项目根目录 `tarot-gift`。项目包含：

- `index.html`：静态前端
- `cards/`：塔罗牌图片资源
- `api/reading.js`：AI 塔罗解读接口
- `api/blessing.js`：隐藏彩蛋祝福接口
- `api/_ai.js`：后端共享 AI 逻辑和 `FRIEND_PROFILE`

Vercel 环境变量至少设置：

```bash
AI_PROVIDER=deepseek
DEEPSEEK_API_KEY=你的_key
```

如使用通义千问兼容模式：

```bash
AI_PROVIDER=qwen
QWEN_API_KEY=你的_key
```

也可以使用 `DASHSCOPE_API_KEY`。不要把 `.env` 提交到仓库。

## 当前完成

- 暗号页，默认暗号为 `0614`
- 欢迎页、提问页、抽牌页、解读页
- 单牌 / 三牌阵
- 中部浅弧形牌带，一次显示 7 张，可按钮或滚轮切换
- 选牌后飞出、停顿、3D 翻牌、落位
- 78 张完整塔罗牌数据
- 78 张轻量网页牌图，来自本机已有 Rider-Waite 资源压缩版
- 正逆位系统
- 每日一牌
- 塔罗图鉴与详情弹窗
- 历史记录，保存在 localStorage
- 每 5 次完成正式占卜触发隐藏彩蛋
- AI 解读接口 `/api/reading`
- AI 隐藏彩蛋接口 `/api/blessing`
- AI 失败时自动回退到本地模板解读

## 常改位置

- 暗号：`index.html` 中的 `PASSWORD`
- 朋友画像：`api/_ai.js` 中的 `FRIEND_PROFILE`
- 首页寄语：搜索 `安の晴夜预言`
- 隐藏彩蛋 fallback 文案：搜索 `FALLBACK_BLESSINGS`
- 卡牌含义：`tarotDeck` 数组里的 `upright` / `reversed`

## 后续建议

- 将 Rider-Waite 临时牌图替换为定制水彩牌图
- 可继续替换 Rider-Waite 临时牌图为定制水彩牌图
