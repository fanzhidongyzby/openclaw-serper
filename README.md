# OpenClaw Serper Plugin

Google Serper API 搜索插件，为 OpenClaw 提供强大的网页搜索和学术检索能力。

## 功能特性

✅ **网页搜索**：通过 Google Serper API 获取最新搜索结果

✅ **学术检索**：通过 Google Scholar API 查找论文和学术文献

✅ **智能结果**：返回标题、URL、摘要等结构化信息

✅ **学术详情**：包含作者、年份、引用次数、发表刊物等详细信息

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

编辑 `~/.openclaw/gateway.env`：

```bash
SERPER_API_KEY=your-api-key-here
```

### 3. 重启 Gateway

```bash
openclaw gateway restart
```

## 使用方式

### 工具调用

OpenClaw 会自动识别搜索需求并调用相应工具：

**网页搜索：**
```
你：帮我搜索最新的 AI 发展趋势
AI：[自动调用 serper_search]
```

**学术检索：**
```
你：搜索 Transformer 架构的相关论文
AI：[自动调用 serper_scholar]
```

### Skill 场景

**serper-search skill 会在以下场景自动激活：**
- 🔍 **搜索查询**："搜索"、"查找"、"研究"
- 📰 **新闻获取**："今天有什么新闻"
- 🔬 **技术调研**："研究一下 LangChain"
- ✅ **事实验证**："查查这个说法是否正确"

**serper-scholar skill 会在以下场景自动激活：**
- 📚 **学术搜索**："论文"、"文献"、"学术研究"
- 🎓 **论文查找**："搜索关于...的论文"
- 🔬 **领域调研**："查找...的研究进展"
- 👨‍🔬 **作者研究**："查找...的论文"

## 参数说明

### serper_search（网页搜索）

| 参数 | 类型 | 必选 | 默认值 | 说明 |
|------|------|------|--------|------|
| query | string | ✅ | - | 搜索关键词 |
| num | number | ❌ | 5 | 结果数量（最大 20） |
| gl | string | ❌ | cn | 国家代码（cn, us, uk, etc.） |
| hl | string | ❌ | zh-CN | 语言代码（zh-CN, en, etc.） |

### serper_scholar（学术检索）

| 参数 | 类型 | 必选 | 默认值 | 说明 |
|------|------|------|--------|------|
| query | string | ✅ | - | 搜索关键词 |
| num | number | ❌ | 10 | 结果数量（最大 20） |
| gl | string | ❌ | cn | 国家代码（cn, us, uk, etc.） |
| hl | string | ❌ | zh-CN | 语言代码（zh-CN, en, etc.） |

**返回额外字段：**
- `authors`：作者列表
- `year`：发表年份
- `citationCount`：引用次数
- `publication`：发表刊物/会议
- `type`：文献类型（PDF、HTML 等）

## 示例

### 网页搜索

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

### 学术检索

```javascript
// 搜索学术论文
serper_scholar({
  query: "Transformer architecture attention",
  num: 5
})

// 搜索特定领域
serper_scholar({
  query: "Reinforcement learning robotics",
  num: 10,
  gl: "us",
  hl: "en"
})

// 搜索中文学术文献
serper_scholar({
  query: "大语言模型 微调",
  gl: "cn",
  hl: "zh-CN"
})
```

## 目录结构

```
extensions/serper/
├── index.js              # 插件入口，注册两个工具
├── openclaw.plugin.json  # 插件元数据
├── package.json          # npm 包配置
├── README.md             # 本文档
├── LICENSE               # MIT 许可证
├── .gitignore            # Git 忽略文件
└── skills/
    ├── serper-search/    # 网页搜索 skill
    │   └── SKILL.md
    └── serper-scholar/   # 学术检索 skill
        └── SKILL.md
```

## 工具对比

| 特性 | serper_search | serper_scholar |
|------|---------------|----------------|
| **用途** | 网页搜索 | 学术检索 |
| **端点** | `/search` | `/scholar` |
| **返回信息** | 标题、链接、摘要 | + 作者、年份、引用、刊物 |
| **适用场景** | 快速信息查询 | 深度学术研究 |
| **知识图谱** | ✅ 支持 | ❌ 不支持 |
| **结果数量默认** | 5 | 10 |

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
