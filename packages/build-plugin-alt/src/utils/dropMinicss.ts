import Config from "webpack-chain"

/**
 * Removes the mini-css extraction logic from the webpack config.
 * @param {*} config 
 */
export default (config: Config) => {
  config.plugins.delete('MiniCssExtractPlugin');
  ['scss', 'css', 'less'].forEach((ruleName) => {
    ['', '-module'].forEach((suffix) => {
      const finalRuleName = `${ruleName}${suffix}`;
      config.module.rule(finalRuleName).uses.delete('MiniCssExtractPlugin.loader');
      config.module.rule(finalRuleName)
        .use('style-loader')
        .before('css-loader')
        .loader(require.resolve('style-loader'));
    });
  });
}