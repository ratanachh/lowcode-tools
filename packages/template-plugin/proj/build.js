module.exports = {
  plugins: [
    'build-plugin-fusion',
    [
      '@rchh/build-plugin-alt',
      {
        type: 'plugin',
        // Enable inject debug mode, see https://lowcode-engine.cn/site/docs/guide/expand/editor/cli
        inject: true,
        // The page to open. In inject debug mode the browser is not opened unless this is set.
        // The official demo project works out of the box: https://lowcode-engine.cn/demo/demo-general/index.html
        // openUrl: 'https://lowcode-engine.cn/demo/demo-general/index.html?debug',
      }
    ]
  ]
}