# fbi-task-migrate
Migration a fbi 2.x project to 3.0

> This is a fbi task. If you haven't installed [fbi](https://github.com/AlloyTeam/fbi) yet, use the following command to install.
>
> `$ npm i -g fbi`

[中文 README](./README_zh.md)

## Requirements
- `fbi v3.0+`
- `node v7.6+`

## Usage
```bash
$ fbi add https://github.com/fbi-templates/fbi-task-migrate.git
$ cd path/to/project-via-fbiv2
$ fbi migrate  
```
This will do:
1. Set new template information from old template info. (`package.json/fbi`)
1. Back up old tasks & options to `fbi.bak` folder.
1. Copy new tasks & options to `fbi` folder.
1. Write merged options to `fbi/options.js`.
1. Add `fbi.bak` to .gitignore which exist.

If you have custom options or custom building logic, you need to migrate them manually.

## More
- [Official templates](https://github.com/fbi-templates)
- [fbi full documentation](https://neikvon.gitbooks.io/fbi/content/)

## Changelog

- **2017.12.06** (Version: `1.0.0`)
1. Init. Support `fbi-project-vue`(formerly `vue2`)