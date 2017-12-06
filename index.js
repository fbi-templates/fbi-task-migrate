const fs = require('fs')
const path = require('path')

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
  let newVersion = 'v2.0.0'
  const tmplInfo = ctx.stores[newTmplName]
  ctx.logger.debug('tmplInfo:\n', tmplInfo)

  // Check if template exist
  if (!tmplInfo) {
    throw `Template \`${newTmplName}\` not exist.`
  }

  // Check if template version exist
  if (!tmplInfo.version || !tmplInfo.version.all.includes(newVersion)) {
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
  return tmplInfo
}

function mergeOptions(projOpts, tmplOpts) {
  const replaceMap = [
    {
      src: 'server:.+?},',
      dst: 'server:.+?},',
      srcFlags: 's',
      dstFlags: 's'
    },
    {
      src: 'data:.+?}[^alias]+},',
      dst: 'data:.+?}[^alias]+},',
      srcFlags: 's',
      dstFlags: 's'
    },
    {
      src: 'alias:.+?}?}',
      dst: 'alias:.+?}?}',
      srcFlags: 'gs',
      dstFlags: 's'
    }
  ]

  replaceMap.map(item => {
    const srcRegex = new RegExp(item.src, item.srcFlags)
    ctx.logger.debug('srcRegex:\n', srcRegex)
    const arr = projOpts.cnt.match(srcRegex)
    const oldCnt = arr[arr.length - 1]
    ctx.logger.debug('oldCnt:\n', oldCnt)

    if (oldCnt) {
      const dstRegex = new RegExp(item.dst, item.dstFlags)
      ctx.logger.debug('dstRegex:\n', dstRegex)
      tmplOpts.cnt = tmplOpts.cnt.replace(dstRegex, oldCnt)
    }
  })
  return tmplOpts.cnt
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
      throw 'Local project options not found.'
    }
  }

  // 1. set template info
  const tmplInfo = await setTemplateInfo(projOpts)
  ctx.logger.log('1. Template information has set in `paskage.json`.')
  const tmplOptsPath = path.join(tmplInfo.path, ctx.configs.TEMPLATE_CONFIG)
  ctx.logger.debug('tmplOptsPath:', tmplOptsPath)
  const tmplOpts = await getOptions(tmplOptsPath)

  const newOptsCnt = mergeOptions(projOpts, tmplOpts)

  // 2. back up old tasks & options
  const taskFolder = ctx.utils.path.cwd('fbi')
  await ctx.utils.fs.move(taskFolder, taskFolder + '.bak')
  ctx.logger.log('2. Old tasks and options backed up in `fbi.bak`.')

  // 3. copy new tasks & options
  await ctx.utils.fs.copy({
    from: path.join(tmplInfo.path, ctx.configs.TEMPLATE_TASKS),
    to: taskFolder,
    quiet: true
  })
  ctx.logger.log(
    `3. New tasks and options placed in \`${ctx.configs.TEMPLATE_TASKS}\`.`
  )

  // 4. write merged options
  await ctx.utils.fs.write(
    ctx.utils.path.cwd(ctx.configs.TEMPLATE_CONFIG),
    newOptsCnt
  )
  ctx.logger.log('4. Merged options updated.')

  // 5. add `fbi.bak` to .gitignore
  const gitignoreFilepath = ctx.utils.path.cwd('.gitignore')
  if (await ctx.utils.fs.exist(gitignoreFilepath)) {
    try {
      fs.appendFileSync(gitignoreFilepath, '\nfbi.bak')
      ctx.logger.log('5. `fbi.bak` added to `.gitignore`.')
    } catch (err) {}
  }
}
