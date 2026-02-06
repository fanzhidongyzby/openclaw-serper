# OpenClaw Serper Plugin

Google Serper API 集成的网络搜索插件，为 OpenClaw 提供强大的网页搜索能力。

## 功能特性

✅ **实时搜索**：通过 Google Serper API 获取最新搜索结果

✅ **智能结果**：返回标题、URL、摘要等结构化信息

✅ **多语言支持**：支持中文、英文等多语言搜索

✅ **灵活配置**：可自定义结果数量、地区、语言

✅ **Skill 集成**：提供智能搜索 skill，自动识别搜索意图

## 安装

安装 serper 插件：

```bash
openclaw plugins install https://github.com/fanzhidongyzby/openclaw-serper.git
```

确认 serper 插件为 `loaded` 状态。

```
openclaw plugins list
```

## 配置

### 1. 获取 Serper API Key

访问 [https://serper.dev/](https://serper.dev/) 注册并获取 API Key。

### 2. 配置环境变量

编辑 `~/.openclaw/.env`：

```bash
SERPER_API_KEY=your-api-key-here
```

### 3. 重启 Gateway

```bash
openclaw gateway restart
```

## 使用方式

### 工具调用

在对话中，OpenClaw 会自动识别搜索需求并调用工具：

```
你：帮我搜索最新的 AI 发展趋势
AI：[自动调用 serper_search]
```

### Skill 场景

Serper skill 会在以下场景自动激活：

- 🔍 **搜索查询**："搜索"、"查找"、"研究"
- 📰 **新闻获取**："今天有什么新闻"
- 🔬 **技术调研**："研究一下 LangChain"
- ✅ **事实验证**："查查这个说法是否正确"

## 参数说明

### serper_search

| 参数 | 类型 | 必选 | 默认值 | 说明 |
|------|------|------|--------|------|
| query | string | ✅ | - | 搜索关键词 |
| num | number | ❌ | 5 | 结果数量（最大 20） |
| gl | string | ❌ | cn | 国家代码（cn, us, uk, etc.） |
| hl | string | ❌ | zh-CN | 语言代码（zh-CN, en, etc.） |

## 示例

```javascript
// 基础搜索
serper_search({ query: "Python 3.13 新特性" })

// 获取更多结果
serper_search({
  query: "人工智能 最新进展",
  num: 10
})

// 搜索英文内容
serper_search({
  query: "AI agents best practices 2025",
  gl: "us",
  hl: "en"
})
```

## 目录结构

```
extensions/serper/
├── index.js              # 插件入口，注册工具
├── openclaw.plugin.json  # 插件元数据
├── package.json          # npm 包配置
├── README.md             # 本文档
├── LICENSE               # MIT 许可证
├── .gitignore            # Git 忽略文件
└── skills/
    └── serper-search/
        └── SKILL.md      # 搜索 skill 定义
```

## 开发与贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 相关链接

- [Serper 官网](https://serper.dev/)
- [OpenClaw 文档](https://docs.openclaw.ai/)
- [ClawHub](https://clawhub.com/)

---

**Made with ❤️ for OpenClaw Community**
