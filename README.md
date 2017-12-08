# fbi-task-migrate
Migrate a fbi 2.x project to 3.0

> This is a fbi task. If you haven't installed [fbi](https://github.com/AlloyTeam/fbi) yet, use the following command to install.
>
> `$ npm i -g fbi`

[中文 README](./README_zh.md)

## Requirements
- `fbi v3.0+`
- `node v7.6+`

## Usage

**Step 1** Add or update target new template.

```bash
# Add:
$ fbi add https://github.com/fbi-templates/fbi-project-vue.git

# Update:
$ fbi up vue
```

**Step 2** Add or update `migrate` task.
```bash
# Add:
$ fbi add https://github.com/fbi-templates/fbi-task-migrate.git

# Update:
$ fbi up migrate
```

**Step 3** Migration.
```bash
$ cd path/to/project-via-fbiv2
$ fbi migrate
```
This will do:
1. Set new template information from old template info. (`package.json/fbi`)
1. Back up old tasks & options to `fbi.bak` folder.
1. Copy new tasks & options to `fbi` folder.
1. Write merged options to `fbi/options.js`.
1. Add `fbi.bak` to .gitignore which exist.
1. Install missing dependencies if necessary.

If you have custom options or custom building logic, you need to migrate them manually.

## Supported templates
| New | Old |
| --- | --- |
|[fbi-project-vue](https://github.com/fbi-templates/fbi-project-vue)|[fbi-template-vue](https://github.com/neikvon/fbi-template-vue)
|[fbi-project-mod](https://github.com/fbi-templates/fbi-project-mod)|[fbi-template-mod](https://github.com/neikvon/fbi-template-mod)|
> Stay tuned for more

## More
- [Official templates](https://github.com/fbi-templates)
- [fbi full documentation](https://neikvon.gitbooks.io/fbi/content/)

## Changelog

- **2017.12.08** (`1.2.0`)
  - New feture: Support `fbi-project-mod`(formerly `fbi-template-mod`)
  - New feture: Change template version if necessary
  - New feture: Install missing dependencies if necessary
  - Bugs fixed

- **2017.12.06** (`1.1.0`)
  - New feture: install missing dependencies automatically

- **2017.12.06** (`1.0.1`)
  - Fix template path

- **2017.12.06** (`1.0.0`)
  - Init. Support `fbi-project-vue`(formerly `fbi-template-vue`)