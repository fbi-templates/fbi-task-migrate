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
```bash
$ fbi add https://github.com/fbi-templates/fbi-task-migrate.git
$ cd path/to/project-via-fbiv2
$ fbi migrate  
```
会执行如下事务:
1. 基于旧模板信息设置新的模板信息. (`package.json/fbi`)
1. 备份旧的选项和任务到 `fbi.bak` 目录.
1. 拷贝新的选项和任务到 `fbi` 目录.
1. 写入合并后的选项到 `fbi/options.js`.
1. 添加 `fbi.bak` 到已存在的 .gitignore 文件.

如果你有自定义选项和构建逻辑，则需要手动迁移它们。

## 更多
- [官方模板库](https://github.com/fbi-templates)
- [fbi完整文档](https://neikvon.gitbooks.io/fbi/content/)

## 变更日志

- **2017.12.06** (Version: `1.0.1`)
1. 修复模板路径错误

- **2017.12.06** (Version: `1.0.0`)
1. 初始化. 支持 `fbi-project-vue`(以前的 `vue2`)