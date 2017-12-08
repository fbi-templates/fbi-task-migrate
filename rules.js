module.exports = {
  'fbi-project-vue': {
    version: 'v2.0.0',
    deps: ['vue-template-compiler'],
    rules: [
      {
        reg: 'server:.+?},'
      },
      {
        reg: 'data:.+?}[^alias]+},'
      },
      {
        reg: 'alias:.+?}?}',
        flags: 'gs'
      }
    ]
  },
  'fbi-project-mod': {
    version: 'v2.0.3',
    deps: [],
    rules: [
      {
        reg: 'src:.+?,'
      },
      {
        reg: 'dist:.+?,'
      },
      {
        reg: 'entry:.+?,',
        reg2: `input: '',`
      },
      {
        reg: 'format:.+?,'
      },
      {
        reg: 'banner: .+?`'
      }
    ]
  }
}
