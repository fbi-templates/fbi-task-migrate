# fbi-task-migrate
将项目从fbi 2.0迁移到3.0

> 这是一个fbi任务. 如果你还没有安装 [fbi](https://github.com/AlloyTeam/fbi) , 使用以下命令安装
>
> `$ npm i -g fbi`

[README in English](./README.md)

## 环境要求
- `fbi v3.0+`
- `node v7.6+`

## 使用方法
**第一步** 添加或更新目标新模板.

```bash
# 添加:
$ fbi add https://github.com/fbi-templates/fbi-project-vue.git

# 更新:
$ fbi up vue
```

**第二步** 添加或更新迁移任务.
```bash
# 添加:
$ fbi add https://github.com/fbi-templates/fbi-task-migrate.git

# 更新:
$ fbi up migrate
```

**第三步** 迁移.
```bash
$ cd path/to/project-via-fbiv2
$ fbi migrate
```

会执行如下过程:
1. 基于旧模板信息设置新的模板信息. (`package.json/fbi`)
1. 备份旧的选项和任务到 `fbi.bak` 目录.
1. 拷贝新的选项和任务到 `fbi` 目录.
1. 写入合并后的选项到 `fbi/options.js`.
1. 添加 `fbi.bak` 到已存在的 .gitignore 文件.
1. 必要时安装缺失的依赖.

如果你有自定义选项和构建逻辑，则需要手动迁移它们。

## 支持的模板
| 新 | 旧 |
| --- | --- |
|[fbi-project-vue](https://github.com/fbi-templates/fbi-project-vue)|[fbi-template-vue](https://github.com/neikvon/fbi-template-vue)
|[fbi-project-mod](https://github.com/fbi-templates/fbi-project-mod)|[fbi-template-mod](https://github.com/neikvon/fbi-template-mod)
> 更多的敬请期待

## 更多信息
- [官方模板库](https://github.com/fbi-templates)
- [fbi完整文档](https://neikvon.gitbooks.io/fbi/content/)

## 变更日志

- **2017.12.08** (`1.2.0`)
  - 新特性: 支持 `fbi-project-mod`(以前的 `fbi-template-mod`)
  - 新特性: 更改模板版本的能力
  - 新特性: 安装缺失依赖的能力
  - 修复Bugs

- **2017.12.06** (`1.1.0`)
  - 新特性: 自动安装缺失的依赖

- **2017.12.06** (Version: `1.0.1`)
  - 修复模板路径错误

- **2017.12.06** (Version: `1.0.0`)
   - 初始化. 支持 `fbi-project-vue`(以前的 `vue2`)