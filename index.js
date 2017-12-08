const fs = require('fs')
const path = require('path')
const rules = require('./rules')

async function getOptions(optsFilePath) {
  if (await ctx.utils.fs.exist(optsFilePath)) {
    try {
      return {
        obj: require(optsFilePath),
        cnt: fs.readFileSync(optsFilePath, 'utf8'),
        path: optsFilePath
      }
    } catch (err) {
      return null
    }
  }

  return null
}

async function setTemplateInfo(projOpts) {
  ctx.logger.debug('projOpts:\n', projOpts)
  let oldTmplName = projOpts.obj.template
  if (!oldTmplName) {
    throw 'The old template name not specified.'
  }

  if (oldTmplName === 'vue2') {
    oldTmplName = 'vue'
  }

  const newTmplName = `${ctx.configs.TEMPLATE_PREFIX}${oldTmplName}`
  let newVersion = rules[newTmplName].version
  const tmplInfo = ctx.stores[newTmplName]
  ctx.logger.debug('tmplInfo:\n', tmplInfo)

  // Check if template exist
  if (!tmplInfo) {
    throw `New template \`${newTmplName}\` not found. \nMake sure it is installed and the name is correct. \nOfficial templates: https://github.com/fbi-templates`
  }

  // Check if template version exist
  if (
    !tmplInfo.version ||
    !tmplInfo.version.all ||
    !tmplInfo.version.all.includes(newVersion)
  ) {
    ctx.logger.warn(
      `Template \`${newTmplName}\` version \`${newVersion}\` not exist.`
    )
    newVersion = ''
  }

  const cfg = {
    fbi: {
      template: {
        name: newTmplName,
        version: newVersion
      }
    }
  }
  ctx.logger.debug('cfg:\n', cfg)

  const pkgPath = ctx.utils.path.cwd('package.json')
  let oldPkg
  try {
    oldPkg = require(pkgPath)
  } catch (err) {
    oldPkg = {}
  }
  ctx.logger.debug('oldPkg:\n', oldPkg)

  const newPkg = ctx.utils.assign({}, oldPkg, cfg)
  ctx.logger.debug('newPkg:\n', newPkg)
  await ctx.utils.fs.write(pkgPath, JSON.stringify(newPkg, null, 2))
  return ctx.utils.assign({}, tmplInfo, {
    targetVersion: newVersion
  })
}

async function changeTemplateVersion(tmplInfo) {
  const changed = await ctx.version.change({
    dir: tmplInfo.path,
    name: tmplInfo.fullname,
    version: tmplInfo.targetVersion,
    showlog: false,
    logger: ctx.logger,
    store: ctx.store
  })
}

function mergeOptions(projOpts, tmplOpts, tmplInfo) {
  const _rules = rules[tmplInfo.fullname].rules
  if (_rules) {
    _rules.map(rule => {
      const srcRegex = new RegExp(rule.reg, rule.flags || 's')
      ctx.logger.debug('srcRegex:\n', srcRegex)
      const arr = projOpts.cnt.match(srcRegex)
      if (arr) {
        const oldCnt = arr[arr.length - 1]
        ctx.logger.debug('oldCnt:\n', oldCnt)

        if (oldCnt) {
          const dstRegex = new RegExp(rule.reg2 || rule.reg, rule.flags2 || 's')
          ctx.logger.debug('dstRegex:\n', dstRegex)
          tmplOpts.cnt = tmplOpts.cnt.replace(dstRegex, oldCnt)
        }
      }
    })
  }

  return tmplOpts.cnt
}

async function installDeps(tmplInfo, deps) {
  // `Vue2`: install vue-template-compiler.
  try {
    const opts = {
      path: process.cwd(),
      type: 'prod',
      force: true
    }
    if (tmplInfo.fullname === 'fbi-project-vue') {
      return Promise.all(
        deps.map(async dep => {
          if (dep === 'vue-template-compiler') {
            const localPKg = require(ctx.utils.path.cwd('package.json'))
            const vueVersion = localPKg.dependencies.vue
            const pkgInfo = `${dep}@${vueVersion}`
            await ctx.install('', [pkgInfo], null, [opts])
          }
        })
      )
    } else {
      return Promise.all(
        deps.map(async dep => {
          await ctx.install('', [dep], null, [opts])
        })
      )
    }
  } catch (err) {}
}

module.exports = async () => {
  const projOptsPath = ctx.utils.path.cwd('fbi/config.js')
  ctx.logger.debug('projOptsPath:', projOptsPath)
  const projOpts = await getOptions(projOptsPath)

  if (!projOpts) {
    if (
      await ctx.utils.fs.exist(ctx.utils.path.cwd(ctx.configs.TEMPLATE_CONFIG))
    ) {
      return ctx.logger.log('Did nothing. This project has been migrated.')
    } else {
      throw 'Local project options not found. Please check if `fbi/config.js` exist.'
    }
  }
  let num = 1

  // 1. set template info
  const tmplInfo = await setTemplateInfo(projOpts, rules)
  if (!tmplInfo) {
    return
  }
  const matchedRules = rules[tmplInfo.fullname]
  ctx.logger.log(`${num++}. Template information has set in \`paskage.json\`.`)
  const tmplOptsPath = path.join(tmplInfo.path, ctx.configs.TEMPLATE_CONFIG)
  ctx.logger.debug('tmplOptsPath:', tmplOptsPath)

  // change template's version
  await changeTemplateVersion(tmplInfo)

  const tmplOpts = await getOptions(tmplOptsPath)

  const newOptsCnt = mergeOptions(projOpts, tmplOpts, tmplInfo)

  // 2. back up old tasks & options
  const taskFolder = ctx.utils.path.cwd('fbi')
  await ctx.utils.fs.move(taskFolder, taskFolder + '.bak')
  ctx.logger.log(`${num++}. Old tasks and options backed up in \`fbi.bak\`.`)

  // 3. copy new tasks & options
  await ctx.utils.fs.copy({
    from: path.join(tmplInfo.path, ctx.configs.TEMPLATE_TASKS),
    to: taskFolder,
    quiet: true
  })
  ctx.logger.log(
    `${num++}. New tasks and options placed in \`${ctx.configs
      .TEMPLATE_TASKS}\`.`
  )

  // 4. write merged options
  await ctx.utils.fs.write(
    ctx.utils.path.cwd(ctx.configs.TEMPLATE_CONFIG),
    newOptsCnt
  )
  ctx.logger.log(`${num++}. Merged options updated.`)

  // 5. add `fbi.bak` to .gitignore
  const gitignoreFilepath = ctx.utils.path.cwd('.gitignore')
  if (await ctx.utils.fs.exist(gitignoreFilepath)) {
    try {
      fs.appendFileSync(gitignoreFilepath, '\nfbi.bak')
      ctx.logger.log(`${num++}. \`fbi.bak\` added to \`.gitignore\`.`)
    } catch (err) {}
  }

  // Install deps
  if (matchedRules.deps.length) {
    await installDeps(tmplInfo, matchedRules.deps)
    ctx.logger.log(`${num++}. Missing dependencies installed.`)
  }
}
